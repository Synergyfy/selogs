import { Module } from '@nestjs/common';
import { CapabilityService } from './capability.service';
import { CapabilityGuard } from './capability.guard';

/**
 * Declares CapabilityService and CapabilityGuard.
 *
 * Import this module into AppModule, then register CapabilityGuard
 * as a global APP_GUARD so it runs on every route (no-op when no
 * @Capability() decorator is present).
 */
@Module({
  providers: [CapabilityService, CapabilityGuard],
  exports: [CapabilityService, CapabilityGuard],
})
export class CapabilityModule {}
