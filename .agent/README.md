# Selogs — Agent Knowledge Base

This `.agent/` folder is the **single source of truth** for AI coding agents working on this project.
Every rule file here is **mandatory**. Read them all before writing any code.

## Files in this folder

| File | Purpose |
|------|---------|
| `project.md` | Project overview, product context, and high-level architecture |
| `architecture.md` | Detailed technical architecture for both apps |
| `rules.md` | Universal coding rules that apply to the whole monorepo |
| `backend.md` | NestJS API rules: module structure, Prisma setup, testing |
| `database.md` | **Database rules** — Prisma v7 setup, schema design, migrations, query patterns, indexing, connection pooling |
| `security.md` | **Security & performance rules** — JWT/cookies, guards, tenant isolation, input validation, rate limiting, caching, logging, error handling |
| `swagger.md` | Swagger/OpenAPI documentation rules — every endpoint must follow this |
| `frontend.md` | React/Vite web app rules: components, state, routing |
| `typescript.md` | TypeScript strict-mode rules — no `any`, proper typing everywhere |

## Quick-start

1. Read `project.md` to understand what the product does.
2. Read `architecture.md` to understand how the code is organised.
3. Read `rules.md` for universal rules.
4. Read `backend.md` or `frontend.md` depending on what you are changing.
5. Read `database.md` before touching `schema.prisma`, writing migrations, or writing Prisma queries.
6. Read `security.md` before adding any endpoint, guard, or caching layer.
7. Read `swagger.md` if touching any backend endpoint (mandatory for all API work).
8. Read `typescript.md` before writing any TypeScript.

> **Never skip a rule file.** Rules exist because a mistake was already made once.
