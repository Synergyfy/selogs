# Technical Architecture

## Monorepo Structure

The repository uses **pnpm workspaces** orchestrated by **Turborepo**.

```
selogs/
├── apps/
│   ├── api/          NestJS 11 — REST API backend
│   └── web/          React 19 + Vite 8 — PWA frontend
├── packages/         Shared libraries (future)
├── turbo.json        Turborepo task pipeline
├── pnpm-workspace.yaml
└── package.json      Root package (scripts only — no app deps here)
```

### Turborepo Tasks

| Task | Cache | Persistent | Description |
|------|-------|-----------|-------------|
| `build` | ✅ | ❌ | Outputs `dist/` or `.next/` |
| `dev` | ❌ | ✅ | Long-running dev servers |
| `lint` | ✅ | ❌ | ESLint across all apps |

Run everything from the monorepo root:
```bash
pnpm dev      # starts api + web concurrently
pnpm lint     # lints all packages
```

Never run `pnpm build` unless explicitly requested by the user or verifying production correctness.

---

## Backend — `apps/api`

**Runtime**: Node.js  
**Framework**: NestJS 11 (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`)  
**Language**: TypeScript 5.7 (strict null checks, `noImplicitAny: true` — see `typescript.md`)  
**Test runner**: Jest + Supertest  
**ORM**: Prisma (see `backend.md` for migration rules)

### Module Pattern

Every feature lives in its own NestJS module folder:

```
src/
├── app.module.ts             Root module — imports feature modules
├── main.ts                   Bootstrap (CORS, pipes, prefix)
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── auth/                     Example feature module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.service.spec.ts
│   ├── dto/
│   │   ├── create-auth.dto.ts
│   │   └── login.dto.ts
│   └── guards/
│       └── jwt-auth.guard.ts
└── ...
```

Rules:
- Every feature module must be **self-contained**: controller + service + DTOs + guards all live inside the feature folder.
- Global things (Prisma, config) live in dedicated top-level folders.
- No business logic in controllers — controllers only validate input and delegate to services.
- Services contain all business logic.
- DTOs use `class-validator` decorators for all input validation.
- Guards/interceptors are applied at controller or route level via decorators, never inside service methods.

### Request Lifecycle

```
HTTP Request
    → Global Pipes (ValidationPipe with whitelist + transform)
    → Guards (JWT, Roles)
    → Controller (route handler)
    → Service (business logic + Prisma calls)
    → Response
```

### API Conventions

- Base prefix: `/api/v1`
- Auth endpoints: `/api/v1/auth/...`
- Resources use RESTful naming: `GET /api/v1/entries`, `POST /api/v1/entries`, etc.
- All responses use a consistent envelope — do not change the response shape without updating the frontend.
- HTTP status codes are used correctly: `201 Created`, `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`.

---

## Frontend — `apps/web`

**Framework**: React 19  
**Build tool**: Vite 8  
**Language**: TypeScript ~6.0  
**Routing**: React Router v7  
**PWA**: `vite-plugin-pwa` + Workbox  
**Offline storage**: Dexie (IndexedDB wrapper)  
**Native mobile**: Capacitor (Android + iOS)  
**Animations**: Framer Motion  
**Icons**: Lucide React  
**OCR**: Tesseract.js (plate scanning)

### Directory Structure

```
apps/web/src/
├── App.tsx              Root router + theme management
├── main.tsx             React entry point + AuthProvider
├── types.ts             Shared TypeScript types (ThemeMode, UserRole, etc.)
├── index.css            Global design system (CSS variables, utilities)
├── components/          One file per component (Component.tsx + Component.css)
├── context/             React Context providers (AuthContext.tsx)
└── services/            Stateless service modules
    ├── db.ts            Dexie database schema + instance
    ├── ocr.ts           Plate OCR via Tesseract.js
    ├── NotificationService.ts
    └── SyncService.ts
```

### Component Conventions

- Each component lives in `components/<ComponentName>.tsx` with an optional co-located `<ComponentName>.css`.
- Components are **not** placed in sub-folders unless they are closely related sub-components that are never used independently.
- Props interfaces are defined at the top of the file (named `<ComponentName>Props`) or inline for small components.
- No default exports for anything other than components and pages — use named exports for utilities, hooks, types.

### Routing

Routing is centralised in `App.tsx`:

```
/                     → LandingPage (public)
/features             → FeaturesPage (public)
/pricing              → PricingPage (public)
/login                → LoginPage (public)
/create-account       → CreateAccount (public)
/dashboard/*          → Protected (requires auth) — DashboardLayout
/app/*                → MobileApp (PWA shell — device/shift based)
/super-admin/*        → Protected (role: admin) — SuperAdminLayout
```

Route protection is handled by `<ProtectedRoute roles={[...]}>`. Always use this wrapper for authenticated routes.

### State Management

- **Auth state**: `AuthContext` via `useAuth()` hook — provides `user`, `userRole`, `organization`, `isLoading`.
- **Local DB state**: Dexie live queries via `dexie-react-hooks` or manual `useEffect` loads.
- **UI state**: `useState` / `useReducer` inside components — no global state library.
- No Redux, Zustand, or MobX. Keep state local. Lift only when necessary.

### Offline-First

- All vehicle entries are written to Dexie (IndexedDB) first, then synced to the server.
- `synced: boolean` field on `VehicleEntry` tracks unsynced records.
- The `SyncService` handles sync when online.
- Never assume a network call will succeed — always handle the offline case.

### Theme System

- Theme is stored in `localStorage` as `themeMode` (`light` | `dark` | `system`).
- Applied to `document.documentElement` via `data-theme` attribute.
- CSS variables are defined in `index.css` for both themes.
- Use CSS variables (`var(--accent)`, `var(--surface)`, etc.) everywhere — never hardcode colours.
