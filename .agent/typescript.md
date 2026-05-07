# TypeScript Rules — No `any`, Strict Typing Everywhere

These rules apply to **both** `apps/api` and `apps/web`.

---

## The Golden Rule

> **`any` is banned.** Using `any` is equivalent to turning TypeScript off. It propagates unsafely through the codebase and defeats the entire purpose of type-checking.

The one exception: third-party library code that you genuinely cannot type (e.g., an untyped legacy package). In that case, create a local declaration file and use `unknown` first. If you truly must use `any`, add a comment explaining why no alternative exists.

---

## Common Mistakes and How to Fix Them

### ❌ Mistake: Untyped function parameters

```typescript
// ❌ Wrong
function processEntry(entry: any) { ... }

// ✅ Correct
function processEntry(entry: VehicleEntry) { ... }
```

### ❌ Mistake: Casting to `any` to silence errors

```typescript
// ❌ Wrong
const result = (someValue as any).property;

// ✅ Correct — narrow the type properly
if (typeof someValue === 'object' && someValue !== null && 'property' in someValue) {
  const result = (someValue as { property: string }).property;
}
```

### ❌ Mistake: `any[]` arrays

```typescript
// ❌ Wrong
const items: any[] = [];

// ✅ Correct
const items: VehicleEntry[] = [];
```

### ❌ Mistake: Untyped JSON.parse

```typescript
// ❌ Wrong
const data = JSON.parse(raw);

// ✅ Correct — parse then assert or validate
const data = JSON.parse(raw) as OrganizationInfo;
// Even better: use a validation library (zod, class-transformer) to parse and validate simultaneously
```

### ❌ Mistake: Untyped event handlers

```typescript
// ❌ Wrong
const handleChange = (e: any) => { ... }

// ✅ Correct
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }
```

### ❌ Mistake: Untyped catch clauses

```typescript
// ❌ Wrong
} catch (e: any) {
  console.error(e.message);
}

// ✅ Correct
} catch (e: unknown) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}
```

### ❌ Mistake: Implicit `any` in reduce / generics

```typescript
// ❌ Wrong
const totals = entries.reduce((acc, entry) => {
  acc[entry.staffId] = (acc[entry.staffId] || 0) + 1;
  return acc;
}, {});

// ✅ Correct
const totals = entries.reduce<Record<string, number>>((acc, entry) => {
  acc[entry.staffId] = (acc[entry.staffId] ?? 0) + 1;
  return acc;
}, {});
```

---

## `unknown` vs `any`

When the type is genuinely unknown at compile time, use `unknown` and **narrow** it before use:

```typescript
function parseApiResponse(raw: unknown): VehicleEntry {
  // Validate shape before returning
  if (!isVehicleEntry(raw)) throw new Error('Invalid API response shape');
  return raw;
}

function isVehicleEntry(val: unknown): val is VehicleEntry {
  return (
    typeof val === 'object' &&
    val !== null &&
    'id' in val &&
    'plateNumber' in val
  );
}
```

---

## Typing Prisma Results

Prisma generates types for all models. Use them:

```typescript
import { Prisma, VehicleEntry } from '@prisma/client';

// For queries that include relations, use Prisma's GetPayload utility:
type EntryWithStaff = Prisma.VehicleEntryGetPayload<{
  include: { staff: true };
}>;

// Service return type must be explicit
async findById(id: string): Promise<EntryWithStaff> {
  const entry = await this.prisma.vehicleEntry.findUnique({
    where: { id },
    include: { staff: true },
  });
  if (!entry) throw new NotFoundException(`Entry ${id} not found`);
  return entry;
}
```

---

## Typing API Responses (Frontend)

Define a typed interface for every API response shape. Never infer response types from `fetch`:

```typescript
// src/services/entriesService.ts

interface CreateEntryResponse {
  id: string;
  plateNumber: string;
  timestamp: number;
  status: 'IN' | 'OUT';
}

export async function createEntry(dto: CreateEntryDto): Promise<CreateEntryResponse> {
  const res = await fetch('/api/v1/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(`Failed to create entry: ${res.status}`);
  return res.json() as Promise<CreateEntryResponse>;
}
```

---

## Typing Context

React context must be fully typed — never use the `createContext<any>()` pattern:

```typescript
// ✅ Correct
interface AuthContextValue {
  user: AuthUser | null;
  userRole: UserRole | null;
  organization: Organization | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

---

## Generics Over `any`

When writing reusable utilities, use generics:

```typescript
// ❌ Wrong
function groupBy(items: any[], key: string): Record<string, any[]> { ... }

// ✅ Correct
function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> { ... }
```

---

## tsconfig Settings

### Backend (`apps/api/tsconfig.json`)
The following settings **must** be active:
- `"strict": true` — or at minimum all individual strict flags enabled.
- `"noImplicitAny": true` — **override the current `false` value** as soon as existing implicit-any violations are fixed.
- `"strictNullChecks": true` ✅ already enabled.

> **Note**: The current API tsconfig has `"noImplicitAny": false`. This is a temporary state from the initial scaffold. Each new file and refactored area should be written with no implicit `any` regardless of this flag, and the goal is to flip this to `true` as the codebase matures.

### Frontend (`apps/web/tsconfig.app.json`)
Already uses TypeScript ~6.0 strict defaults. Do not weaken any flags.

---

## Enums and Union Types

Prefer **union types** for simple, closed sets of strings:

```typescript
// ✅ Preferred for simple discriminated unions
type UserRole = 'admin' | 'supervisor' | 'guard' | 'super_admin';
type Plan = 'starter' | 'business' | 'enterprise';
type EntryStatus = 'IN' | 'OUT';
```

Use **Prisma enums** on the backend so the type is generated from the schema (single source of truth).

Do not mix: if the backend uses a Prisma enum, the frontend must mirror it as a union type with identical string values.

---

## Type Assertions (`as`)

Use `as` sparingly and only when you have verified correctness:
- ✅ `JSON.parse(raw) as KnownType` — acceptable when you control the data source.
- ✅ `ref.current as HTMLInputElement` — acceptable in React ref access.
- ❌ `(value as any).someProperty` — never acceptable.
- ❌ Using `as` to suppress TypeScript errors instead of fixing the root cause.

When in doubt, use a type guard function instead of an assertion.
