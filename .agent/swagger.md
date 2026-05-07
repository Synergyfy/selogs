# Swagger / OpenAPI Documentation Rules — `apps/api`

Every endpoint **must** be fully documented with Swagger decorators before it is considered done.
Undocumented endpoints will not be merged.

---

## Setup

Swagger is configured in `src/main.ts` using `@nestjs/swagger`:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const config = new DocumentBuilder()
    .setTitle('Selogs API')
    .setDescription(
      'REST API for the Selogs vehicle entry logging platform. ' +
      'All protected endpoints require a Bearer JWT token.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter the JWT token obtained from POST /api/v1/auth/login',
      },
      'access-token', // ← this is the key used in @ApiBearerAuth() decorators
    )
    .addTag('auth', 'Authentication — login, register, refresh, logout')
    .addTag('entries', 'Vehicle entry and check-out operations')
    .addTag('staff', 'Staff management')
    .addTag('branches', 'Branch management')
    .addTag('devices', 'Device registration and management')
    .addTag('organisations', 'Organisation settings and branding')
    .addTag('subscriptions', 'Plan subscriptions and billing')
    .addTag('super-admin', 'Super Admin — platform governance')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // keeps the token between page refreshes
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

Swagger UI is available at: `http://localhost:3000/docs`

---

## Required Packages

```bash
pnpm add @nestjs/swagger swagger-ui-express --filter api
```

---

## Controller Documentation

Every controller must have these decorators:

```typescript
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('entries')                  // groups the controller under a tag in the UI
@ApiBearerAuth('access-token')       // marks all routes as requiring JWT (unless overridden)
@Controller('entries')
export class EntriesController { ... }
```

If only **some** routes require auth, apply `@ApiBearerAuth('access-token')` at the route level instead.

---

## Route-Level Decorators

Apply these to **every** route handler. No exceptions.

### `@ApiOperation` — describes what the endpoint does

```typescript
@ApiOperation({
  summary: 'Create a new vehicle entry',
  description:
    'Records a vehicle arriving at a branch. The entry is initially ' +
    'created with status IN. Requires the guard or admin role.',
})
```

- `summary`: one short sentence (shown in the collapsed route list).
- `description`: full explanation including business rules, constraints, and side effects.

### `@ApiResponse` — documents every possible response

Document **all** response codes the endpoint can return:

```typescript
@ApiResponse({
  status: 201,
  description: 'Entry created successfully.',
  type: CreateEntryResponseDto,
})
@ApiResponse({
  status: 400,
  description: 'Validation failed — invalid plate number format or missing required fields.',
})
@ApiResponse({
  status: 401,
  description: 'Missing or invalid Bearer token.',
})
@ApiResponse({
  status: 403,
  description: 'Authenticated user does not have the required role.',
})
@ApiResponse({
  status: 404,
  description: 'Branch not found.',
})
```

Always include at least: the success code, `400`, `401`, `403`, and `404` where applicable.

### `@ApiParam` — path parameters

```typescript
@ApiParam({
  name: 'id',
  description: 'UUID of the vehicle entry',
  example: 'a3f2c1d0-4e5b-6789-abcd-ef0123456789',
})
```

### `@ApiQuery` — query string parameters

```typescript
@ApiQuery({
  name: 'branchId',
  required: false,
  description: 'Filter entries by branch ID',
  example: 'branch_01HXZ2Y3Z4',
})
@ApiQuery({
  name: 'status',
  required: false,
  enum: ['IN', 'OUT'],
  description: 'Filter by entry status',
})
```

### `@ApiBody` — explicit request body (use when Swagger cannot infer from DTO)

Usually Swagger infers the body from the DTO class. Use `@ApiBody` only when you need to override or add extra detail:

```typescript
@ApiBody({
  type: CreateEntryDto,
  description: 'Vehicle entry payload. plateNumber must be a valid Nigerian plate format.',
})
```

---

## DTO Documentation

DTOs are the primary source of Swagger schema information. Every DTO property **must** have `@ApiProperty` or `@ApiPropertyOptional`.

### Required properties — `@ApiProperty`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateEntryDto {
  @ApiProperty({
    description: 'Vehicle registration plate number',
    example: 'LAG-123-AB',
  })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty({
    description: 'UUID of the branch where the vehicle is entering',
    example: 'a3f2c1d0-4e5b-6789-abcd-ef0123456789',
  })
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({
    description: 'UUID of the device logging the entry',
    example: 'b1c2d3e4-f5a6-7890-bcde-f01234567890',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
```

### Optional properties — `@ApiPropertyOptional`

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateEntryDto {
  // ... required fields above

  @ApiPropertyOptional({
    description: "Driver's phone number for SMS notifications",
    example: '+2348012345678',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Any additional notes about the vehicle or visit',
    example: 'Delivery van — expected to exit within 2 hours',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
```

### Enum properties

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EntryStatus } from '@prisma/client';

export class UpdateEntryDto {
  @ApiProperty({
    enum: EntryStatus,
    description: 'Entry status — IN when arriving, OUT when leaving',
    example: EntryStatus.OUT,
  })
  @IsEnum(EntryStatus)
  status: EntryStatus;
}
```

### Nested objects

```typescript
@ApiProperty({
  description: 'Staff member who logged the entry',
  type: () => StaffSummaryDto, // use a lambda for forward references
})
staff: StaffSummaryDto;
```

---

## Response DTOs

Create a dedicated response DTO for every endpoint's success response. Do not return raw Prisma objects.

```typescript
// dto/entry-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EntryResponseDto {
  @ApiProperty({ example: 'a3f2c1d0-4e5b-6789-abcd-ef0123456789' })
  id: string;

  @ApiProperty({ example: 'LAG-123-AB' })
  plateNumber: string;

  @ApiProperty({ example: 1715000000000, description: 'Unix timestamp (ms) of entry' })
  timestamp: number;

  @ApiProperty({ enum: ['IN', 'OUT'], example: 'IN' })
  status: 'IN' | 'OUT';

  @ApiPropertyOptional({ example: '+2348012345678' })
  phoneNumber?: string;

  @ApiProperty({ example: false, description: 'Whether the record has been synced to the server' })
  synced: boolean;
}
```

---

## Public Routes

If an endpoint does not require auth (e.g. `POST /auth/login`), do **not** add `@ApiBearerAuth()` to that route. This ensures the Swagger UI correctly shows it as an open endpoint.

If the controller is marked with `@ApiBearerAuth()` at the class level but a specific route is public, use `@Public()` on that route and add a note in `@ApiOperation`:

```typescript
@ApiOperation({
  summary: 'Log in and receive a JWT token',
  description: 'Public endpoint — no token required. Returns an access token on success.',
})
@ApiResponse({ status: 200, type: AuthTokenResponseDto })
@ApiResponse({ status: 401, description: 'Invalid email or password.' })
@Public()
@Post('login')
async login(@Body() dto: LoginDto): Promise<AuthTokenResponseDto> {
  return this.authService.login(dto);
}
```

---

## Complete Annotated Example

```typescript
// entries.controller.ts
import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiResponse,
  ApiParam, ApiQuery,
} from '@nestjs/swagger';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { EntryResponseDto } from './dto/entry-response.dto';

@ApiTags('entries')
@ApiBearerAuth('access-token')
@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @ApiOperation({
    summary: 'List all vehicle entries',
    description:
      'Returns a paginated list of vehicle entries for the authenticated ' +
      'user\'s organisation. Guards can only see entries for their branch. ' +
      'Supervisors see their assigned branches. Admins see all.',
  })
  @ApiQuery({ name: 'branchId', required: false, description: 'Filter by branch UUID' })
  @ApiQuery({ name: 'status', required: false, enum: ['IN', 'OUT'] })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Paginated list of entries.', type: [EntryResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  async findAll(
    @Query('branchId') branchId?: string,
    @Query('status') status?: 'IN' | 'OUT',
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<EntryResponseDto[]> {
    return this.entriesService.findAll({ branchId, status, page, limit });
  }

  @ApiOperation({
    summary: 'Create a new vehicle entry',
    description:
      'Logs a vehicle arriving at a branch. plateNumber is stored in ' +
      'uppercase. A push notification is sent to the branch supervisor if ' +
      'notifications are enabled for the organisation.',
  })
  @ApiResponse({ status: 201, description: 'Entry created.', type: EntryResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error — see response body for field details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Insufficient role.' })
  @ApiResponse({ status: 404, description: 'Branch or device not found.' })
  @HttpCode(201)
  @Post()
  async create(@Body() dto: CreateEntryDto): Promise<EntryResponseDto> {
    return this.entriesService.create(dto);
  }

  @ApiOperation({
    summary: 'Get a single vehicle entry by ID',
    description: 'Returns a single entry. Returns 404 if not found or not ' +
      'accessible to the authenticated user\'s organisation.',
  })
  @ApiParam({ name: 'id', description: 'Entry UUID', example: 'a3f2c1d0-4e5b-6789-abcd-ef0123456789' })
  @ApiResponse({ status: 200, type: EntryResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Entry not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EntryResponseDto> {
    return this.entriesService.findById(id);
  }
}
```

---

## Checklist Before Merging an Endpoint

- [ ] Controller has `@ApiTags(...)`.
- [ ] Controller or route has `@ApiBearerAuth('access-token')` if protected.
- [ ] Route has `@ApiOperation({ summary, description })`.
- [ ] All success and error responses are documented with `@ApiResponse`.
- [ ] All path params have `@ApiParam`.
- [ ] All query params have `@ApiQuery`.
- [ ] All DTO properties have `@ApiProperty` or `@ApiPropertyOptional` with `description` and `example`.
- [ ] A dedicated response DTO exists — raw Prisma model is never returned directly.
- [ ] Swagger UI at `/docs` shows the endpoint correctly with a valid sample payload.
