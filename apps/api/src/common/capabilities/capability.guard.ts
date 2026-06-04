import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { CapabilityService } from './capability.service';
import { CAPABILITY_KEY, CapabilityType } from './capability.types';
import { NotificationsService } from '../../notifications/notifications.service';

/**
 * CapabilityGuard — subscription-aware access control.
 *
 * Sits after AtGuard and RolesGuard in the execution chain.
 * Registered globally in app.module.ts as an APP_GUARD — it is a no-op
 * on any route that has no @Capability() decorator.
 *
 * Checks (in order):
 * 1. If no @Capability() metadata is present → pass through.
 * 2. If the user is super_admin → bypass entirely (platform operator, not tenant).
 * 3. Derive organizationId from the JWT payload (never from the request body).
 * 4. Resolve the capability snapshot via CapabilityService.
 * 5. Block if subscription is inactive.
 * 6. Block if a numeric limit is exceeded or a boolean feature is missing.
 */
@Injectable()
export class CapabilityGuard implements CanActivate {
  private readonly logger = new Logger(CapabilityGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly capabilityService: CapabilityService,
    private readonly notifications: NotificationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ── 1. No decorator → pass through ────────────────────────────────────
    const capability = this.reflector.getAllAndOverride<CapabilityType | undefined>(
      CAPABILITY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!capability) return true;

    // ── 2. super_admin bypass ──────────────────────────────────────────────
    const { user } = context.switchToHttp().getRequest<{ user: { sub: string; role: Role; organizationId?: string } }>();

    if (user.role === Role.super_admin) return true;

    // ── 3. Derive organizationId from JWT ──────────────────────────────────
    const organizationId = user.organizationId;

    if (!organizationId) {
      this.logger.warn(`User ${user.sub} has no organizationId in JWT — blocking capability check`);
      throw new ForbiddenException('Your account is not associated with an organisation.');
    }

    // ── 4. Resolve snapshot ────────────────────────────────────────────────
    const snapshot = await this.capabilityService.resolve(organizationId);

    // ── 5. Subscription active check ──────────────────────────────────────
    if (!snapshot.isSubscriptionActive) {
      throw new ForbiddenException(
        'Your subscription is inactive. Please renew your plan to continue.',
      );
    }

    // ── 6. Per-capability checks ───────────────────────────────────────────
    switch (capability) {
      case 'branch:create': {
        const { branches } = await this.capabilityService.getUsageCounts(organizationId);
        if (branches >= snapshot.branchLimit) {
          await this.notifications.create({
            organizationId,
            type: 'alert',
            title: 'Branch Limit Reached',
            message: `You've reached the branch limit of ${snapshot.branchLimit}. Upgrade your plan or purchase an add-on to add more.`,
            priority: 'high',
          });
          throw new ForbiddenException(
            `Branch limit reached. Your current plan allows ${snapshot.branchLimit} branch(es). Upgrade your plan or purchase an add-on to add more.`,
          );
        }
        break;
      }

      case 'staff:create': {
        const { staff } = await this.capabilityService.getUsageCounts(organizationId);
        if (staff >= snapshot.staffLimit) {
          await this.notifications.create({
            organizationId,
            type: 'alert',
            title: 'Staff Limit Reached',
            message: `You've reached the staff limit of ${snapshot.staffLimit}. Upgrade your plan or purchase an add-on to add more staff.`,
            priority: 'high',
          });
          throw new ForbiddenException(
            `Staff limit reached. Your current plan allows ${snapshot.staffLimit} staff member(s). Upgrade your plan or purchase an add-on to add more.`,
          );
        }
        break;
      }

      case 'device:create': {
        const { devices } = await this.capabilityService.getUsageCounts(organizationId);
        if (devices >= snapshot.deviceLimit) {
          await this.notifications.create({
            organizationId,
            type: 'alert',
            title: 'Device Limit Reached',
            message: `You've reached the device limit of ${snapshot.deviceLimit}. Upgrade your plan or purchase an add-on to add more devices.`,
            priority: 'high',
          });
          throw new ForbiddenException(
            `Device limit reached. Your current plan allows ${snapshot.deviceLimit} device(s). Upgrade your plan or purchase an add-on to add more.`,
          );
        }
        break;
      }

      case 'gate:create': {
        // Gates have no hard numeric cap on the plan — subscription active check is sufficient.
        break;
      }

      case 'ocr:use': {
        if (!snapshot.hasOcr) {
          throw new ForbiddenException(
            'OCR plate recognition is not included in your current plan. Upgrade or purchase the OCR add-on to use this feature.',
          );
        }
        break;
      }

      case 'analytics:use': {
        if (!snapshot.hasAnalytics) {
          throw new ForbiddenException(
            'Advanced analytics is not included in your current plan. Upgrade or purchase the Analytics add-on to use this feature.',
          );
        }
        break;
      }

      case 'export:use': {
        if (!snapshot.hasExport) {
          throw new ForbiddenException(
            'Data export is not included in your current plan. Upgrade or purchase the Export add-on to use this feature.',
          );
        }
        break;
      }
    }


    return true;
  }
}
