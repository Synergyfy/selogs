# Database Rules — Prisma v7 + PostgreSQL

> Applies to: `apps/api`. All Prisma work lives in `apps/api/prisma/`.

---

## 1. Prisma v7 Setup — How It Works Here

This project uses **Prisma v7** with the **driver adapter** model. There is no classic binary engine.

### Connection flow

```
prisma.config.ts          → CLI tools (migrate, generate, studio)
PrismaPg adapter          → Runtime (PrismaService in NestJS)
ConfigService.DATABASE_URL → Single source of truth for the connection string
```

### `prisma.config.ts` (CLI only)

```typescript
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env['DATABASE_URL'] },
});
```

- This file is **only** used by the Prisma CLI — never imported by application code.
- `DATABASE_URL` must be set in `.env` before running any CLI command.

### `PrismaService` (Runtime)

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.get<string>('DATABASE_URL'),
    });
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
```

**Never** instantiate `PrismaClient` or `PrismaPg` anywhere else in the application.

---

## 2. Schema Design Rules

### Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| Model name | PascalCase singular | `VehicleEntry`, `Branch` |
| Field name | camelCase | `plateNumber`, `checkInTime` |
| DB column | snake_case via `@map` | `plate_number`, `check_in_time` |
| DB table | snake_case plural via `@@map` | `vehicle_entries`, `branches` |
| Enum name | PascalCase | `Role`, `EntryStatus` |
| Enum value | lowercase_snake | `super_admin`, `checked_in` |

```prisma
model VehicleEntry {
  id          String      @id @default(uuid())
  plateNumber String      @map("plate_number")
  status      EntryStatus @default(checked_in)
  createdAt   DateTime    @default(now()) @map("created_at")

  @@map("vehicle_entries")
}
```

### IDs

- Always use `String @id @default(uuid())` for primary keys — never auto-increment integers.
- This keeps IDs safe to expose in URLs and avoids enumeration attacks.

### Timestamps

- Every model **must** have `createdAt` and `updatedAt`:

```prisma
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt      @map("updated_at")
```

### Soft deletes

- Never hard-delete records for audit-sensitive data (vehicle entries, payments, staff actions).
- Use a `deletedAt DateTime? @map("deleted_at")` field.
- Filter `where: { deletedAt: null }` in all normal queries.
- Only hard-delete data that has no audit value (e.g., temp tokens).

### Nullability

- Every field is **non-nullable by default** in Prisma. Only mark optional with `?` if the business logic genuinely allows absence.
- Don't use nullable as a shortcut to avoid providing a default — provide the default.

### Relations

- Always define both sides of a relation.
- Always name foreign keys explicitly with `@map`:

```prisma
model Gate {
  id       String @id @default(uuid())
  branchId String @map("branch_id")
  branch   Branch @relation(fields: [branchId], references: [id])
}
```

---

## 3. Migration Protocol — NEVER Reset the Database

### The golden rule

> A migration is **additive and reversible**. If you are about to lose data, stop and think.

### Workflow for every schema change

```bash
# 1. Edit prisma/schema.prisma

# 2. Generate migration SQL for review first (--create-only)
pnpm --filter api exec prisma migrate dev --create-only --name <descriptive-name>

# 3. Review the generated SQL in prisma/migrations/<timestamp>_<name>/migration.sql

# 4. Apply it
pnpm --filter api exec prisma migrate dev

# 5. Commit schema + migration together
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(db): <what changed>"
```

### Adding a non-nullable column to a table with existing rows

**Wrong:**
```prisma
// ❌ Will fail if the table has rows — no default, no nullable
branchCode String @map("branch_code")
```

**Correct approach — option A (Prisma default):**
```prisma
// ✅ Provide a database-level default
branchCode String @default("MAIN") @map("branch_code")
```

**Correct approach — option B (backfill migration):**
```bash
# Generate only the SQL file, do not apply yet
pnpm --filter api exec prisma migrate dev --create-only --name add_branch_code

# Edit the generated migration.sql to add a backfill step BEFORE the NOT NULL constraint:
# UPDATE branches SET branch_code = 'BRANCH-' || id WHERE branch_code IS NULL;

# Then apply
pnpm --filter api exec prisma migrate dev
```

### Renaming a column

Never drop and re-add (data loss). Use `@map` to rename at the TypeScript level while keeping the DB column name, OR write an explicit `ALTER TABLE ... RENAME COLUMN` in the migration SQL.

```prisma
// Rename TS field without touching the DB column
guardName String @map("staff_name")  // DB column stays "staff_name"
```

### Removing a column — 3-step process

1. **Migration 1:** Make the column nullable (`?`). Deploy.
2. **Application update:** Remove all writes to the column. Deploy.
3. **Migration 2:** Drop the column from the schema. Deploy.

Never skip steps — step 2 prevents runtime errors on old pods during a rolling deployment.

### Commands reference

| Command | When to use |
|---------|-------------|
| `prisma migrate dev` | Local development only |
| `prisma migrate deploy` | Production / staging CI |
| `prisma migrate status` | Check pending migrations |
| `prisma generate` | After schema changes to regenerate the client |
| `prisma studio` | Local DB inspection only |
| `prisma migrate reset` | **NEVER** — destroys all data |
| `prisma db push` | **NEVER** in production — bypasses migration history |

---

## 4. Querying — Patterns and Rules

### Always select only what you need

```typescript
// ❌ Returns all columns including passwordHash, refreshTokenHash
const user = await this.prisma.user.findUnique({ where: { id } });

// ✅ Select only what the caller needs
const user = await this.prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    role: true,
  },
});
```

### Never expose password hashes or tokens in responses

Always use `select` or `omit` when returning user data to a controller:

```typescript
const { passwordHash, refreshTokenHash, ...safeUser } = user;
return safeUser;
```

Or with Prisma `omit` (v5+):
```typescript
const user = await this.prisma.user.findUnique({
  where: { id },
  omit: { passwordHash: true, refreshTokenHash: true },
});
```

### findUnique vs findFirst

- Use `findUnique` when querying by a `@unique` or `@id` field — it is type-safe and cannot return multiple rows.
- Use `findFirst` only when you need an arbitrary record matching a non-unique filter.
- Never use `findFirst` as a lazy substitute for `findUnique`.

### Null handling

- `findUnique` returns `null` if not found — always check and throw `NotFoundException`:

```typescript
const entry = await this.prisma.vehicleEntry.findUnique({ where: { id } });
if (!entry) throw new NotFoundException(`Entry ${id} not found`);
```

### Pagination — always paginate list queries

```typescript
async findAll(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [items, total] = await this.prisma.$transaction([
    this.prisma.vehicleEntry.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.vehicleEntry.count(),
  ]);
  return { items, total, page, limit };
}
```

- Default page size: **20**.
- Maximum page size: **100**. Reject requests above this in the DTO.
- Always include `total` in paginated responses.

### Filtering — always scope to the caller's organisation

Every query that returns business data **must** include an `organizationId` (or `branchId`) filter. Never return data that belongs to a different organisation:

```typescript
// ✅ Scoped correctly
const entries = await this.prisma.vehicleEntry.findMany({
  where: {
    branch: { organizationId: user.organizationId },
    deletedAt: null,
  },
});

// ❌ Dangerous — returns all entries across all organisations
const entries = await this.prisma.vehicleEntry.findMany();
```

### Transactions — use for multi-step writes

Any operation that writes to more than one table must use a transaction:

```typescript
const result = await this.prisma.$transaction(async (tx) => {
  const entry = await tx.vehicleEntry.update({ ... });
  await tx.auditLog.create({ ... });
  return entry;
});
```

- Use the `tx` parameter inside the callback — never use `this.prisma` inside a transaction callback.
- Keep transactions short. Do not put network calls, external API calls, or sleeps inside a transaction.
- Set a timeout for long-running transactions:

```typescript
await this.prisma.$transaction(async (tx) => { ... }, {
  maxWait: 5000,   // ms to wait for a connection
  timeout: 10000,  // ms before the transaction is killed
});
```

### Batch operations

Use `createMany` / `updateMany` / `deleteMany` instead of looping:

```typescript
// ❌ N+1 — one query per item
for (const id of ids) {
  await this.prisma.vehicleEntry.update({ where: { id }, data: { synced: true } });
}

// ✅ Single query
await this.prisma.vehicleEntry.updateMany({
  where: { id: { in: ids } },
  data: { synced: true },
});
```

### Raw SQL — last resort only

Use `this.prisma.$queryRaw` only when Prisma's query builder cannot express the query (e.g., complex window functions, CTEs). Always use parameterised queries — never string-interpolate user input:

```typescript
// ✅ Parameterised
const result = await this.prisma.$queryRaw<Row[]>`
  SELECT * FROM vehicle_entries
  WHERE organization_id = ${orgId}
  AND created_at > ${since}
`;

// ❌ SQL injection risk
const result = await this.prisma.$queryRawUnsafe(
  `SELECT * FROM vehicle_entries WHERE id = '${id}'`
);
```

---

## 5. Indexing Rules

Add indexes for every column used in a `WHERE`, `ORDER BY`, or `JOIN`:

```prisma
model VehicleEntry {
  id             String   @id @default(uuid())
  plateNumber    String   @map("plate_number")
  organizationId String   @map("organization_id")
  branchId       String   @map("branch_id")
  status         EntryStatus
  createdAt      DateTime @default(now()) @map("created_at")

  @@index([organizationId, status])          // filter by org + status
  @@index([branchId, createdAt(sort: Desc)]) // list entries per branch sorted newest-first
  @@index([plateNumber])                      // plate search
  @@map("vehicle_entries")
}
```

Rules:
- Compound indexes should put the **most selective** (highest cardinality) column first.
- Index foreign keys — Prisma does **not** auto-index them.
- Do not over-index write-heavy tables (indexes slow down writes).
- Every unique constraint is automatically an index — no need to add `@@index` for unique fields.

---

## 6. Connection Pooling

The `PrismaPg` adapter uses `pg.Pool` internally. Configure the pool in `PrismaService` for production workloads:

```typescript
const adapter = new PrismaPg({
  connectionString: config.get<string>('DATABASE_URL'),
  max: 10,            // max connections in the pool
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});
```

- Default `max` is fine for development. Set it explicitly for staging/production.
- Never use more connections than your database host allows. On a single Postgres instance, keep `max` ≤ 20.

---

## 7. What Never to Do

| ❌ Never | ✅ Instead |
|---------|-----------|
| `prisma migrate reset` | Write a proper migration |
| `prisma db push` on staging/prod | Use `prisma migrate deploy` |
| Edit an applied migration file | Write a new forward migration |
| `findMany()` with no `where` or `take` | Always filter and paginate |
| Expose `passwordHash` / `refreshTokenHash` | Use `select` / `omit` |
| Use `$queryRawUnsafe` with user input | Use tagged template `$queryRaw` |
| Nest database calls inside a loop | Use `createMany`, `updateMany`, or `$transaction` |
| Open a transaction around an HTTP call | Keep transactions DB-only |
| Access `this.prisma` inside a `$transaction` callback | Use the `tx` argument |
