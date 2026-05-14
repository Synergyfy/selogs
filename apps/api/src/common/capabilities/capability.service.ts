import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import { CapabilitySnapshot } from './capability.types';

@Injectable()
export class CapabilityService {
  private readonly logger = new Logger(CapabilityService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves the merged capability snapshot for an organisation.
   *
   * Merges the organisation's active plan limits with any active,
   * non-expired add-ons that have been purchased by the organisation.
   *
   * Rules:
   * - Subscription is considered active when status is `active` or `trialing`
   *   AND endDate is either null (ongoing) or in the future.
   * - Numeric limits: plan.limit + Σ(addon.limitInc × quantity) for all
   *   active, non-expired OrganizationAddon rows.
   * - Boolean features: plan.hasFeature OR any active add-on grants it.
   * - If no subscription exists the snapshot marks isSubscriptionActive=false
   *   with zero limits — the guard will block all mutations.
   */
  async resolve(organizationId: string): Promise<CapabilitySnapshot> {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        subscription: {
          select: {
            status: true,
            nextBillingDate: true,
            plan: {
              select: {
                branchLimit: true,
                staffLimit: true,
                deviceLimit: true,
                hasOcr: true,
                hasAnalytics: true,
                hasExport: true,
                isFree: true,
              },
            },
          },
        },
        // Also check the org-level planId as a fallback (set on initial signup)
        plan: {
          select: {
            branchLimit: true,
            staffLimit: true,
            deviceLimit: true,
            hasOcr: true,
            hasAnalytics: true,
            hasExport: true,
            isFree: true,
          },
        },
        addons: {
          where: {
            isActive: true,
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
          select: {
            quantity: true,
            addon: {
              select: {
                branchLimitInc: true,
                staffLimitInc: true,
                deviceLimitInc: true,
                grantsOcr: true,
                grantsAnalytics: true,
                grantsExport: true,
              },
            },
          },
        },
      },
    });

    if (!org) {
      this.logger.warn(`resolve() called for unknown organizationId: ${organizationId}`);
      return this.inactiveSnapshot();
    }

    // Prefer the Subscription record's plan; fall back to the org-level planId.
    const plan = org.subscription?.plan ?? org.plan;

    if (!plan) {
      this.logger.warn(`No plan found for organization ${organizationId}`);
      return this.inactiveSnapshot();
    }

    // ── Subscription active check ──────────────────────────────────────────
    const isSubscriptionActive = this.isActive(org.subscription as any, org.plan as any);

    // ── Numeric limit accumulation ─────────────────────────────────────────
    let branchLimit = plan.branchLimit;
    let staffLimit = plan.staffLimit;
    let deviceLimit = plan.deviceLimit;

    let hasOcr = plan.hasOcr;
    let hasAnalytics = plan.hasAnalytics;
    let hasExport = plan.hasExport;

    for (const orgAddon of org.addons) {
      const { addon, quantity } = orgAddon;
      branchLimit += addon.branchLimitInc * quantity;
      staffLimit += addon.staffLimitInc * quantity;
      deviceLimit += addon.deviceLimitInc * quantity;

      if (addon.grantsOcr) hasOcr = true;
      if (addon.grantsAnalytics) hasAnalytics = true;
      if (addon.grantsExport) hasExport = true;
    }

    return {
      isSubscriptionActive,
      branchLimit,
      staffLimit,
      deviceLimit,
      hasOcr,
      hasAnalytics,
      hasExport,
    };
  }

  /**
   * Returns the current resource usage counts for an organisation in a
   * single database round-trip. Used by CapabilityGuard to check numeric
   * limits without reaching into this service's private Prisma instance.
   */
  async getUsageCounts(organizationId: string): Promise<{
    branches: number;
    staff: number;
    devices: number;
  }> {
    const [branches, staff, devices] = await this.prisma.$transaction([
      this.prisma.branch.count({ where: { organizationId } }),
      this.prisma.user.count({ where: { organizationId, deletedAt: null } }),
      this.prisma.device.count({ where: { organizationId } }),
    ]);
    return { branches, staff, devices };
  }

  // ── Private helpers ────────────────────────────────────────────────────────


  private isActive(
    subscription: { status: SubscriptionStatus; nextBillingDate: Date | null; plan: { isFree: boolean } } | null,
    planFallback: { isFree: boolean } | null,
  ): boolean {
    const isFree = subscription?.plan?.isFree || planFallback?.isFree || false;
    
    // Free plans are always active
    if (isFree) return true;

    if (!subscription) return false;

    const { status, nextBillingDate } = subscription;

    const activeStatuses: SubscriptionStatus[] = [
      SubscriptionStatus.active,
      SubscriptionStatus.trialing,
      SubscriptionStatus.past_due, // Allow usage during past_due period (handled by scheduler/expiry check)
    ];

    if (!activeStatuses.includes(status)) return false;

    // If nextBillingDate is set and status is not trialing/past_due, check if it's in the future.
    // For trial/past_due, we allow usage as long as the status is set (handled by expiry job).
    if (status === SubscriptionStatus.active && nextBillingDate !== null && nextBillingDate <= new Date()) return false;

    return true;
  }

  /** Returns a fully-locked snapshot for orgs with no valid subscription. */
  private inactiveSnapshot(): CapabilitySnapshot {
    return {
      isSubscriptionActive: false,
      branchLimit: 0,
      staffLimit: 0,
      deviceLimit: 0,
      hasOcr: false,
      hasAnalytics: false,
      hasExport: false,
    };
  }
}

