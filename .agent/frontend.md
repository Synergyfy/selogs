# Frontend Rules — `apps/web`

## Stack

- **React 19** (function components only)
- **Vite 8** + `vite-plugin-pwa`
- **TypeScript ~6.0**
- **React Router v7**
- **Dexie 4** (IndexedDB)
- **Framer Motion** for animations
- **Lucide React** for icons
- **Capacitor 8** for native iOS/Android

---

## Component Rules

### One component per file

Each component gets its own `ComponentName.tsx` and optionally `ComponentName.css`.
Do not put multiple exported components in one file unless they are:
- Tiny sub-components (< 20 lines) that exist purely to compose the parent and are never used elsewhere.
- In that case, keep them in the same file but do not export them.

### Props interfaces

Every component must have a typed props interface. Name it `<ComponentName>Props`:

```tsx
// ✅ Correct
interface StaffManagementProps {
  branchId: string;
  onStaffAdded: (staffId: string) => void;
}

export default function StaffManagement({ branchId, onStaffAdded }: StaffManagementProps) { ... }
```

Never use `any` or untyped destructuring for props.

### Function components only

No class components. No `React.Component`. Always use function components with hooks.

### No inline styles

Use CSS classes. All styles go in the co-located `.css` file or in `index.css` for global tokens.

```tsx
// ❌ Wrong
<div style={{ backgroundColor: '#0a0e1a', padding: 16 }}>

// ✅ Correct
<div className="entry-card">
```

### Event handlers

Name event handlers with the `handle` prefix: `handleSubmit`, `handleCheckIn`, `handleDelete`.
Props that accept handlers use the `on` prefix: `onSubmit`, `onCheckIn`, `onDelete`.

---

## Hooks Rules

- Custom hooks live in `src/hooks/` and are named `use<Something>.ts`.
- A hook must have a single, clear responsibility.
- Always clean up side effects in the `useEffect` return function.
- Never call hooks conditionally or inside loops.

---

## Routing Rules

- All routes are declared in `App.tsx` — do not create routes inside feature components.
- Protected routes must be wrapped with `<ProtectedRoute roles={[...]}>`.
- Use `useNavigate()` for programmatic navigation — never use `window.location`.
- The `roles` prop on `ProtectedRoute` must use the `UserRole` type, not raw strings.

```tsx
// ✅ Correct
<Route path="/dashboard/staff" element={
  <ProtectedRoute roles={['admin', 'supervisor']}>
    <DashboardLayout ...><StaffManagement /></DashboardLayout>
  </ProtectedRoute>
} />
```

---

## State Management Rules

### Local state first

Use `useState` and `useReducer` for component-level state.
Do not reach for global state unless the data is needed by many unrelated parts of the tree.

### Auth context

Use `useAuth()` for auth state everywhere. Never read user state from `localStorage` directly in a component.

### Dexie / IndexedDB

All writes to Dexie must be `await`ed.
Use live queries (`useLiveQuery` from `dexie-react-hooks`) where you need reactive UI updates.
The Dexie DB instance is a singleton exported from `services/db.ts` — never create a new instance.

### No external state libraries

Do not add Redux, Zustand, Jotai, MobX, or any other state management library without explicit approval. The app is deliberately kept simple.

---

## Styling Rules

- Use CSS custom properties (variables) defined in `index.css`. Never hardcode colours, spacing, or font sizes.
- Use `data-theme="light"` / `data-theme="dark"` on `<html>` for theming — variables change per theme.
- Class names use kebab-case: `.entry-card`, `.staff-row-actions`.
- Avoid overly specific selectors — prefer class-based styling.
- Animations: use Framer Motion for meaningful transitions (page changes, modals, list inserts). Use CSS transitions for micro-interactions (hover, focus).

---

## Offline-First Rules

- **Write to Dexie first, sync second.** Never make a network request and then write to local DB on success — it must be the other way around.
- Every `VehicleEntry` written to Dexie has `synced: false` until confirmed by the server.
- UI must always reflect the local state, not wait for server confirmation.
- All network calls must handle `navigator.onLine === false` gracefully — show a toast, queue the action, do not crash.

---

## PWA Rules

- Do not break the Service Worker by adding non-cacheable assets to the Workbox glob patterns.
- Test offline functionality when making changes to the sync flow.
- The `registerType: 'autoUpdate'` config in `vite.config.ts` means the SW updates silently — do not change this.
- The Capacitor build targets `apps/web/android` and `apps/web/ios`. Do not modify those directories without understanding Capacitor's sync process.

---

## API Communication

- All HTTP calls to the backend go through service files in `src/services/` — never call `fetch` or `axios` directly inside a component.
- Handle API errors at the service level and surface typed error objects to components.
- Use typed response types for all API calls — the return type of every service function must be explicitly annotated.

---

## Accessibility

- All interactive elements must have accessible labels (`aria-label`, `aria-labelledby`, or visible text).
- Form inputs must have associated `<label>` elements.
- Use semantic HTML: `<button>` for buttons, `<nav>` for navigation, `<main>` for page content, `<header>` for headers.
- Avoid `div` click handlers — use `<button>` instead.

---

## Scripts

```bash
pnpm --filter vehicle-capture-system dev       # dev server
pnpm --filter vehicle-capture-system lint      # lint
pnpm --filter vehicle-capture-system preview   # preview production build
```

Do not run `build` unless asked.
