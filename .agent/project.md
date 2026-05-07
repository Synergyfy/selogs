# Project Overview — Selogs

## What is Selogs?

**Selogs** (Security Entry Logs) is a **commercial SaaS platform** for digital vehicle entry logging in security-critical environments — car parks, estate gates, logistics depots, commercial compounds, etc.

The platform allows organisations to:
- Log vehicle entry and exit events in real time.
- Manage staff, devices, and multiple branches.
- Operate offline-first on mobile devices and sync when back online.
- Subscribe to plans (Starter, Business, Enterprise) with billing via Paystack.
- Give Super Admins a global oversight dashboard.

## User Roles

There are **three operational roles** plus one platform-level role:

| Role | Scope | Description |
|------|-------|-------------|
| `admin` | Organisation-wide | Owns the organisation account, manages billing, staff, devices, branches, and settings |
| `supervisor` | Branch-level | Can view and manage entries, staff, and branches but cannot touch billing or devices |
| `guard` | Device-level | Operates the mobile app to log entries and check-outs on a single device |
| `super_admin` | Platform-wide | Selogs internal staff — accesses the Super Admin panel to manage all organisations, plans, and billing |

Role strings are lowercase. Use the union type `UserRole` defined in `apps/web/src/types.ts` (frontend) and the Prisma `Role` enum (backend). Never use raw strings when a role is expected.

## Plans

| Plan | Key features |
|------|-------------|
| `starter` | Single branch, limited devices, basic reports |
| `business` | Multiple branches, more devices, advanced reports |
| `enterprise` | Unlimited branches/devices, custom branding, priority support |

## Product domain language (use these exact terms in code)

- **Entry** — a vehicle entering a compound. Has a plate number, timestamp, staff ID, device ID.
- **Check-Out** — recording a vehicle leaving. Updates an existing Entry's status to `OUT`.
- **Device** — a physical tablet/phone running the mobile app and registered to a branch.
- **Branch** — a physical location belonging to an organisation.
- **Organisation** — a paying customer account.
- **Sync** — the process of pushing locally-stored offline entries to the server.
- **Shift** — a staff session. Starts at check-in, ends at shift end.

## Repository

```
selogs/                     ← pnpm monorepo root (Turborepo)
├── apps/
│   ├── api/                ← NestJS backend (REST API)
│   └── web/                ← React + Vite frontend (PWA)
├── packages/               ← Future shared packages (currently empty)
├── .agent/                 ← You are here — agent knowledge base
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```
