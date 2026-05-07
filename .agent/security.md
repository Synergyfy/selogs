# Security & Performance Rules — `apps/api`

> Applies to the NestJS API. Revisit this document whenever adding new endpoints, guards, or external integrations.

---

## 1. Authentication — JWT + Refresh Token

### Token architecture

| Token | Storage | Lifetime | Secret |
|-------|---------|----------|--------|
| Access token (AT) | `Authorization: Bearer <token>` header | 15 minutes | `JWT_SECRET` |
| Refresh token (RT) | `HttpOnly` cookie (`refresh_token`) | 7 days | `REFRESH_TOKEN_SECRET` |

**Rules:**
- The AT is short-lived. If it leaks, damage is bounded to 15 minutes.
- The RT is stored in an `HttpOnly` cookie — JavaScript cannot read it, eliminating XSS theft.
- Never store either token in `localStorage` or `sessionStorage`.
- Never return the refresh token in the response body.
- Always set cookie flags: `httpOnly: true`, `secure: true` (production), `sameSite: 'strict'`.

### Refresh token rotation

- On every `/auth/refresh` call, **both** tokens are rotated:
  - New AT issued.
  - New RT issued and stored in the cookie.
  - Old RT hash in the database is overwritten.
- On logout, the RT hash in the database is set to `null` — the cookie is cleared.
- On refresh, compare the incoming RT against the **bcrypt hash** stored in the DB. Reject immediately if no match.

### Token secrets

- Never use weak secrets like `'at-secret'` in staging or production.
- Minimum 32 random bytes (`openssl rand -base64 32`).
- Rotate secrets in a rolling manner — changing a secret invalidates all active tokens.

---

## 2. Authorisation — Guards & Roles

### Guard hierarchy

```
Request
  → AtGuard (global — checks JWT signature and expiry)
  → RolesGuard (applied per-controller or per-route)
  → Route handler
```

### Rules

- `AtGuard` is applied globally in `app.module.ts`. Every route requires a valid JWT unless decorated with `@Public()`.
- Never apply `@Public()` to a route that touches business data.
- Role checks must be done in `RolesGuard` via the `@Roles()` decorator — never inside a service method.
- Always apply the most restrictive roles possible. Prefer explicit allowlists over denylist logic.

```typescript
// ✅ Explicit allowlist
@Roles(Role.admin, Role.super_admin)
@Get('reports')
getReports() { ... }

// ❌ Denylist logic inside a service — wrong layer
async getReports(user: User) {
  if (user.role === 'guard') throw new ForbiddenException();
  ...
}
```

### Organisation scoping — prevent cross-tenant data access

Every service method that returns or mutates data must verify the requesting user belongs to the same organisation as the resource:

```typescript
// ✅ Always scope by organisationId
async findBranch(branchId: string, user: AuthUser) {
  const branch = await this.prisma.branch.findUnique({
    where: { id: branchId },
  });
  if (!branch) throw new NotFoundException();
  if (branch.organizationId !== user.organizationId) {
    throw new ForbiddenException();  // tenant isolation
  }
  return branch;
}
```

This check is **mandatory** for every resource endpoint. Never trust the client to send the correct `organizationId` — derive it from the JWT payload.

---

## 3. Input Validation

### All request bodies must go through DTOs

```typescript
// ✅ DTO with class-validator decorators
export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @Matches(/^[A-Z0-9-]{2,10}$/, { message: 'Invalid branch code format' })
  code: string;
}
```

**Rules:**
- Every field must have at least one validator.
- Never use `@IsOptional()` on a field that is required by the business logic.
- Use `@MaxLength()` on all string fields to prevent payload bloat.
- Use `@IsEnum()` for fields that map to Prisma enums.
- `ValidationPipe` is registered globally with `whitelist: true, forbidNonWhitelisted: true` — unknown fields are rejected automatically.

### Query parameters

- Always validate `@Query()` params with a DTO and `@Type(() => Number)` for numeric pagination:

```typescript
export class PaginationDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}
```

### Route parameters

- Always validate that `@Param('id')` looks like a UUID before hitting the database:

```typescript
@IsUUID('4')
id: string;
```

---

## 4. Password Security

```typescript
// Hashing — always use bcrypt, cost factor ≥ 10
const hash = await bcrypt.hash(plaintext, 10);

// Verification — use compare (timing-safe)
const match = await bcrypt.compare(plaintext, hash);
```

**Rules:**
- Never store plaintext passwords.
- Never use MD5, SHA-1, or SHA-256 for passwords — use bcrypt, argon2, or scrypt only.
- Never log passwords, tokens, or hashes — even in error messages.
- On failed login, always throw a generic `ForbiddenException('Access Denied')` — never reveal whether the email exists.

---

## 5. Rate Limiting

Install and configure `@nestjs/throttler` for all public endpoints:

```bash
pnpm add @nestjs/throttler --filter api
```

```typescript
// app.module.ts
ThrottlerModule.forRoot([{
  name: 'default',
  ttl: 60_000,    // 60 seconds window
  limit: 10,      // max 10 requests per window per IP
}]),

// app.module.ts providers
{ provide: APP_GUARD, useClass: ThrottlerGuard },
```

Apply tighter limits on auth endpoints:

```typescript
@Throttle({ default: { ttl: 60_000, limit: 5 } })
@Post('login')
login() { ... }
```

---

## 6. CORS

Configure CORS explicitly — never use `app.enableCors()` with no options:

```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:5173'],
  credentials: true,       // required for cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

- `ALLOWED_ORIGINS` must be an env variable — never hardcode domains.
- `credentials: true` is required for the `HttpOnly` cookie to be sent by the browser.

---

## 7. HTTP Security Headers

Install Helmet:

```bash
pnpm add helmet --filter api
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

Helmet sets: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `X-XSS-Protection`, and more — all in one call.

---

## 8. Secrets & Environment Variables

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | Full PostgreSQL connection string — never log it |
| `JWT_SECRET` | ≥ 32 random bytes in production |
| `JWT_EXPIRES_IN` | Keep short: `15m` |
| `REFRESH_TOKEN_SECRET` | ≥ 32 random bytes, different from `JWT_SECRET` |
| `REFRESH_TOKEN_EXPIRES_IN` | `7d` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins |
| `PORT` | Default `5001` |

**Rules:**
- All variables are validated at startup via the Joi schema in `AppModule`. The server will not start if any required variable is missing.
- Never log the value of any secret variable.
- Never commit `.env`. Provide `.env.example` with placeholder values.
- Add new required variables to the Joi schema in `app.module.ts` **before** using them.

---

## 9. Performance — Query Optimisation

### Select only needed fields

```typescript
// ❌ Fetches all columns, including large/sensitive ones
const entries = await this.prisma.vehicleEntry.findMany();

// ✅ Select only what the response needs
const entries = await this.prisma.vehicleEntry.findMany({
  select: {
    id: true,
    plateNumber: true,
    status: true,
    checkInTime: true,
    gate: { select: { name: true } },
  },
});
```

### Use `include` carefully

`include` performs a SQL JOIN. Avoid deeply nested includes — they produce large result sets:

```typescript
// ❌ Potentially enormous result set
const org = await this.prisma.organization.findUnique({
  include: {
    branches: {
      include: {
        gates: { include: { entries: true } },
      },
    },
  },
});

// ✅ Fetch relations in separate targeted queries if the nesting is deep
```

### Count separately — avoid `_count` on large tables

Use `prisma.$transaction([query, count])` to fetch both page data and total count in a single round-trip:

```typescript
const [items, total] = await this.prisma.$transaction([
  this.prisma.vehicleEntry.findMany({ skip, take, where }),
  this.prisma.vehicleEntry.count({ where }),
]);
```

### Defer heavy aggregations

Do not compute aggregations (sum, average, count with complex filters) on every request. Cache them (see section 10) or compute them in background jobs.

---

## 10. Caching Strategy

> The project does not currently have a cache layer. Follow these rules when adding one.

### What to cache

| Data | Cache duration | Reason |
|------|---------------|--------|
| Active plan / subscription status | 5 min | Checked on every request |
| Branch list per organisation | 2 min | Rarely changes |
| Role/permission config | Until changed | Static for a user session |
| Vehicle entry counts / stats | 1 min | Dashboard summary tiles |

### What never to cache

- Individual vehicle entries (must be real-time for check-in/check-out accuracy)
- Authentication tokens or session state
- Any write result — always read fresh after a write

### In-memory cache (NestJS built-in) — for single-instance dev/staging

```typescript
// app.module.ts
import { CacheModule } from '@nestjs/cache-manager';

CacheModule.register({ ttl: 60_000, max: 500, isGlobal: true }),
```

```typescript
// service
constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

async getSubscriptionStatus(orgId: string) {
  const key = `sub:${orgId}`;
  const cached = await this.cache.get<SubscriptionStatus>(key);
  if (cached) return cached;

  const status = await this.prisma.subscription.findFirst({ ... });
  await this.cache.set(key, status, 300_000); // 5 min
  return status;
}
```

### Cache invalidation

Always invalidate on writes:

```typescript
async updateSubscription(orgId: string, dto: UpdateSubscriptionDto) {
  const result = await this.prisma.subscription.update({ ... });
  await this.cache.del(`sub:${orgId}`);  // ← always invalidate after write
  return result;
}
```

### Redis (when scaling beyond a single instance)

When the API runs on multiple instances, replace the in-memory store with Redis:

```bash
pnpm add @nestjs/cache-manager cache-manager-ioredis ioredis --filter api
```

```typescript
CacheModule.register({
  isGlobal: true,
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  ttl: 60,
}),
```

Add `REDIS_HOST` and `REDIS_PORT` to the Joi validation schema before using them.

---

## 11. Logging

Use the NestJS `Logger` — never `console.log` in committed code:

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EntriesService {
  private readonly logger = new Logger(EntriesService.name);

  async create(dto: CreateEntryDto) {
    this.logger.log(`Creating entry for plate ${dto.plateNumber}`);
    // ...
    this.logger.warn(`Duplicate plate detected: ${dto.plateNumber}`);
    this.logger.error(`Failed to save entry`, error.stack);
  }
}
```

**Rules:**
- Log the **action**, not the secret. Never log JWT tokens, passwords, or `DATABASE_URL`.
- Use `logger.error(message, stack)` — always include the stack trace for errors.
- Use `logger.warn` for recoverable/expected issues (duplicate plate, rate limit).
- Use `logger.log` for normal operations (entity created, sync completed).
- Use `logger.debug` for verbose dev-only output — these are silenced in production by log level config.

---

## 12. Error Handling — Never Leak Internals

```typescript
// ✅ Correct — generic message, NestJS HTTP exception
throw new NotFoundException('Entry not found');
throw new BadRequestException('Plate number is required');
throw new ForbiddenException('Access Denied');
throw new ConflictException('Vehicle is already inside this branch');

// ❌ Never do these
throw new Error(dbError.message);         // leaks DB internals
res.status(500).json({ error: err });     // bypasses NestJS exception filter
throw err;                                 // unhandled, crashes the process
```

Add a global exception filter to ensure unexpected errors never expose stack traces to clients:

```typescript
// src/common/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status >= 500) {
      this.logger.error('Unhandled exception', (exception as Error)?.stack);
    }

    response.status(status).json({
      statusCode: status,
      message: exception instanceof HttpException
        ? exception.message
        : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
```

Register it in `main.ts`:
```typescript
app.useGlobalFilters(new AllExceptionsFilter());
```

---

## 13. What Never to Do

| ❌ Never | ✅ Instead |
|---------|-----------|
| Store tokens in `localStorage` | Use `HttpOnly` cookie for RT, memory for AT |
| Use `app.enableCors()` with no options | Configure origins explicitly |
| Skip `@Roles()` on admin endpoints | Always apply the guard |
| Scope queries by `user.organizationId` from the request body | Derive `organizationId` from the JWT payload |
| Log `DATABASE_URL`, passwords, or tokens | Log only non-sensitive identifiers |
| Use `console.log` | Use `Logger` from `@nestjs/common` |
| Throw raw `Error` objects from services | Use NestJS `HttpException` subclasses |
| Cache write results | Always read fresh after a write; only cache reads |
| Use `$queryRawUnsafe` with user input | Use tagged template `$queryRaw` |
| Hard-code allowed origins | Use `ALLOWED_ORIGINS` env variable |
