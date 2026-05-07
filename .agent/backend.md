# Backend Rules — `apps/api`

## Stack

- **NestJS 11** with Express platform
- **Prisma** ORM (PostgreSQL)
- **Jest** for unit and E2E tests
- **class-validator** + **class-transformer** for DTO validation

---

## Prisma Setup & Migration Rules

### ⚠️ CRITICAL: Migration Protocol — Never Reset the Database

The database is **never reset** to handle a migration. Resetting destroys production data. Follow this protocol for all schema changes:

#### Adding a new column or table

1. Edit `prisma/schema.prisma`.
2. Run: `pnpm --filter api exec prisma migrate dev --name <descriptive-name>`
   - This creates a new versioned migration file in `prisma/migrations/`.
   - **Never edit existing migration files** — Prisma uses checksums and will detect tampering.
3. If the new column is non-nullable and the table already has rows, you **must** provide a default:
   - Option A: Add `@default(...)` in the schema.
   - Option B: Write a migration SQL that backfills the value before the `NOT NULL` constraint is applied.
   - Use `prisma migrate dev --create-only` to generate the SQL file first, then manually add the backfill step before applying it with `prisma migrate dev`.
4. Commit both `prisma/schema.prisma` **and** `prisma/migrations/` together in the same commit.

#### Renaming a column or model

- Never rename by dropping and re-adding — this loses data.
- Use Prisma's `@map` (for columns) and `@@map` (for tables) to rename at the TypeScript level while keeping the database name unchanged, OR write an explicit `ALTER TABLE ... RENAME COLUMN` migration.

#### Removing a column

1. Make the column optional in the schema first (`?` nullable).
2. Deploy that migration.
3. Remove any application code that writes to the column.
4. Only then, in a **subsequent** migration, drop the column from the schema and run the migration.

#### Never do

- `prisma migrate reset` — destroys all data.
- `prisma db push` in production or staging — bypasses the migration history.
- Manually altering the database schema without a corresponding Prisma migration.
- Editing the contents of `prisma/migrations/` after they have been applied.

#### Production deployments

- Migrations are applied with `prisma migrate deploy` (not `migrate dev`) in production/staging.
- `migrate deploy` only applies pending migrations; it never generates new ones.

---

## Prisma Service

There must be a single `PrismaService` that wraps `PrismaClient`:

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
```

- Inject `PrismaService` into services via the constructor — never instantiate `PrismaClient` directly.
- Export `PrismaModule` as a global module so it does not need to be imported in every feature module.

---

## Module Structure

Every feature follows this pattern exactly:

```
src/<feature>/
├── <feature>.module.ts       Declares controller, providers, imports
├── <feature>.controller.ts   HTTP route handlers (thin — no business logic)
├── <feature>.service.ts      Business logic + Prisma queries
├── <feature>.service.spec.ts Unit tests for the service
└── dto/
    ├── create-<feature>.dto.ts
    └── update-<feature>.dto.ts (if needed)
```

### Controller rules

- Controllers **only** handle HTTP concerns: parsing params/body, calling service, returning response.
- Use `@Body()`, `@Param()`, `@Query()` decorators — never access `req.body` directly.
- Apply `@UseGuards()`, `@Roles()`, `@HttpCode()` at the route level.
- Return the result of the service method directly — do not reshape data in the controller.

```typescript
// ✅ Correct
@Get(':id')
async getEntry(@Param('id') id: string): Promise<EntryResponseDto> {
  return this.entriesService.findById(id);
}

// ❌ Wrong — business logic in controller
@Get(':id')
async getEntry(@Param('id') id: string) {
  const entry = await this.prisma.entry.findUnique({ where: { id } });
  if (!entry) throw new NotFoundException();
  return entry;
}
```

### Service rules

- Services hold all business logic and all Prisma queries.
- Every public method must have a JSDoc comment explaining the business rule.
- Throw NestJS HTTP exceptions for error cases — never return `null` where an exception is appropriate.
- Use `async/await` — no raw Promises or callbacks.

### DTO rules

- All request body DTOs must use `class-validator` decorators.
- All DTO properties must have explicit types (no `any`).
- Use `@IsEnum()` for enum fields, `@IsString()`, `@IsInt()`, `@IsBoolean()`, etc.
- Mark optional fields with `@IsOptional()` and the `?` TypeScript modifier.

```typescript
// ✅ Correct DTO
import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { Plan } from '@prisma/client';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Plan)
  plan: Plan;

  @IsString()
  @IsOptional()
  logo?: string;
}
```

---

## Authentication & Authorisation

- JWT-based auth. Guards live in `src/auth/guards/`.
- `JwtAuthGuard` is applied globally (in `app.module.ts`); routes that should be public are decorated with `@Public()`.
- Role-based access uses a `@Roles(...roles: UserRole[])` decorator + `RolesGuard`.
- Never implement role checks inside service methods — that is the guard's job.

---

## Environment Variables

Validated at startup via `@nestjs/config`. If a variable is missing the app **must not start**.

Required variables (document new ones here as they are added):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Prisma PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | JWT expiry duration (e.g. `7d`) |
| `PORT` | Port the API listens on (default `3000`) |

---

## Testing

### Unit tests (`*.spec.ts`)

- Co-located with source files.
- Mock `PrismaService` using a typed mock — never use `any` for mocks.
- Use `@nestjs/testing` `Test.createTestingModule(...)`.
- Test one method per `it()` block.
- Test both the happy path and error paths.

### E2E tests (`test/`)

- Use Supertest against a real NestJS app instance.
- Use a separate test database (env var `DATABASE_URL` points to a test DB in CI).
- Run in band (sequentially): `jest --runInBand`.
- Clean up test data in `afterEach` or `afterAll`.

### Scripts

```bash
pnpm --filter api test          # unit tests
pnpm --filter api test:e2e      # E2E tests
pnpm --filter api test:cov      # coverage report
```
