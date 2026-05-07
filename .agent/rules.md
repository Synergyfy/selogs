# Universal Coding Rules

These rules apply across the entire monorepo — backend and frontend alike.

---

## 1. Language & TypeScript

- **No `any` type — ever.** See `typescript.md` for all typing rules and alternatives.
- All new files must be TypeScript (`.ts` or `.tsx`). Never create `.js` files inside `src/`.
- Enable and respect `strict` mode settings. Do not downgrade tsconfig options to work around a type error — fix the type properly.
- Use `type` for unions/aliases. Use `interface` for object shapes that may be extended. Be consistent within a file.

## 2. Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Files (components) | PascalCase | `DashboardLayout.tsx` |
| Files (services, modules) | camelCase | `syncService.ts` |
| Files (Prisma, config) | kebab-case | `prisma.service.ts` |
| React components | PascalCase | `StaffManagement` |
| TypeScript interfaces | PascalCase | `VehicleEntry` |
| TypeScript types | PascalCase | `ThemeMode` |
| Variables & functions | camelCase | `handleCheckIn` |
| Constants | UPPER_SNAKE | `MAX_DEVICES_PER_BRANCH` |
| Prisma models | PascalCase | `Organization` |
| Database columns | snake_case (Prisma `@map`) | `plate_number` |
| API route handlers | camelCase verbs | `getEntries`, `createEntry` |
| CSS class names | kebab-case | `.dashboard-layout` |
| CSS variables | `--kebab-case` | `--accent`, `--surface-alt` |

## 3. No Magic Strings / Numbers

- Never use raw role strings like `'admin'`. Use the `UserRole` type union or the Prisma `Role` enum.
- Never hard-code plan names — use the `Plan` type/enum.
- Never hard-code API base URLs — use environment variables.
- Extract repeated string literals into named constants.

## 4. Error Handling

- Backend: use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`, etc.). Never `throw new Error()` in a controller or service — always use the appropriate `HttpException` subclass.
- Frontend: catch errors at the call site, show user-friendly messages via toast/notification. Never `console.error` in production paths without also showing UI feedback.
- Never swallow errors silently (`catch (e) {}`). At minimum log them; preferably surface them to the user.

## 5. Environment Variables

- All secrets and environment-specific values must come from environment variables.
- Backend env vars must be validated with `@nestjs/config` + a validation schema on startup — the server must crash, not silently fail, if a required env var is missing.
- Frontend env vars must be prefixed with `VITE_` and accessed via `import.meta.env`.
- Never commit `.env` files. Always provide a `.env.example`.

## 6. Comments & Documentation

- Prefer **self-documenting code** over comments. Name things clearly.
- Add comments only when the "why" is not obvious from the code.
- All public service methods on the backend should have a one-line JSDoc comment explaining the business rule they enforce.
- Never leave `// TODO` comments committed to the main branch — either do it or open an issue.

## 7. Git & Commits

- Commit messages: `<type>(<scope>): <short description>` — e.g. `feat(entries): add plate OCR scanning`.
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`.
- Never commit directly to `main`. Always use a feature branch and PR.
- Never commit build artefacts (`dist/`, `.next/`, `*.tsbuildinfo`).

## 8. Testing

- Every new service method must have a corresponding unit test.
- Every new API endpoint must have a corresponding E2E test.
- Do not write tests that mock so much that they stop proving anything.
- Tests are co-located with the source: `auth.service.spec.ts` sits next to `auth.service.ts`.
- E2E tests live in `apps/api/test/`.

## 9. Dependencies

- Add dependencies only through pnpm: `pnpm add <pkg> --filter <workspace>`.
- Do not install packages at the root level unless they are dev tooling used across all workspaces (e.g., `turbo`).
- Prefer well-maintained, typed packages. If a package lacks types, add `@types/<pkg>` or write a local declaration file.

## 10. Do Not

- Do **not** run `pnpm build` unless explicitly requested.
- Do **not** reset the database to work around a migration — see `backend.md`.
- Do **not** use `console.log` for debugging in committed code — use the NestJS `Logger` on the backend.
- Do **not** store secrets in code.
- Do **not** use inline styles in React components — use CSS classes.
- Do **not** add new npm scripts to `apps/*/package.json` without documenting them here.
