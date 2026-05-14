import { SetMetadata } from '@nestjs/common';
import { CAPABILITY_KEY, CapabilityType } from './capability.types';

/**
 * Marks a route handler as requiring a specific subscription capability.
 *
 * The CapabilityGuard (registered globally) will read this metadata and
 * verify that the requesting organisation's plan (+ add-ons) grants the
 * capability and that numeric limits have not been exceeded.
 *
 * Routes without this decorator are not affected by CapabilityGuard.
 *
 * @example
 * ```typescript
 * @Capability('branch:create')
 * @Roles(Role.admin)
 * @Post()
 * async create(...) { ... }
 * ```
 */
export const Capability = (capability: CapabilityType) =>
  SetMetadata(CAPABILITY_KEY, capability);
