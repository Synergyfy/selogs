import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaystackService } from '../paystack/paystack.service';
import { PlansService } from '../plans/plans.service';
import { CapabilityService } from '../common/capabilities';
import { CheckoutDto } from './dto/checkout.dto';
import { SubscriptionStatus, BillingCycle } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paystack: PaystackService,
    private readonly plansService: PlansService,
    private readonly capabilityService: CapabilityService,
  ) {}

  /**
   * Get current subscription and usage summary for an organization
   */
  async getOrgSubscription(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        subscription: {
          include: { plan: true },
        },
        plan: true, // fallback if subscription record doesn't exist yet
      },
    });

    if (!org) throw new NotFoundException('Organization not found');

    const activePlan = org.subscription?.plan || org.plan;
    
    // Calculate usage
    const [branchCount, staffCount, deviceCount] = await Promise.all([
      this.prisma.branch.count({ where: { organizationId } }),
      this.prisma.user.count({ where: { organizationId } }),
      this.prisma.device.count({ where: { organizationId } }),
    ]);

    // Resolve merged capabilities (plan + add-ons) — this is the single source
    // of truth for limits. Using it here keeps usage.limits consistent with the
    // capabilities object and avoids a second org query.
    const capabilities = await this.capabilityService.resolve(organizationId);

    return {
      subscription: org.subscription,
      activePlan,
      usage: {
        branches: {
          used: branchCount,
          limit: capabilities.branchLimit,
        },
        staff: {
          used: staffCount,
          limit: capabilities.staffLimit,
        },
        devices: {
          used: deviceCount,
          limit: capabilities.deviceLimit,
        },
      },
      capabilities,
    };

  }

  /**
   * Initialize a new subscription checkout
   */
  async initializeCheckout(organizationId: string, email: string, dto: CheckoutDto) {
    const plan = await this.plansService.findOne(dto.planId);
    
    if (plan.isFree) {
      throw new BadRequestException('Cannot purchase a free plan');
    }

    let planAmount = plan.monthlyPrice;
    let months = 1;

    if (dto.billingCycle === BillingCycle.QUARTERLY) {
      planAmount = plan.quarterlyPrice || plan.monthlyPrice * 3;
      months = 3;
    } else if (dto.billingCycle === BillingCycle.YEARLY) {
      planAmount = plan.yearlyPrice || plan.monthlyPrice * 12;
      months = 12;
    }

    let addonsAmount = 0;
    if (dto.addonIds && dto.addonIds.length > 0) {
      const addons = await this.prisma.addon.findMany({
        where: { id: { in: dto.addonIds }, isActive: true },
      });
      if (addons.length !== dto.addonIds.length) {
        throw new BadRequestException('One or more invalid add-ons provided');
      }
      addonsAmount = addons.reduce((sum, addon) => sum + (addon.monthlyPrice * months), 0);
    }

    const totalAmount = planAmount + addonsAmount;

    const metadata = {
      organizationId,
      planId: plan.id,
      billingCycle: dto.billingCycle,
      addonIds: dto.addonIds || [],
      type: 'checkout',
    };

    const result = await this.paystack.initializeTransaction(email, totalAmount, metadata);
    return {
      access_code: result.data.access_code,
      authorization_url: result.data.authorization_url,
      reference: result.data.reference,
    };
  }

  /**
   * Start a trial for a plan
   */
  async startTrial(organizationId: string, planId: string) {
    const plan = await this.plansService.findOne(planId);
    if (!plan.trialEnabled) {
      throw new BadRequestException('Trial is not enabled for this plan');
    }

    const existingSub = await this.prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (existingSub && existingSub.status !== SubscriptionStatus.trialing && existingSub.status !== SubscriptionStatus.canceled) {
      throw new BadRequestException('Organization already has an active subscription');
    }

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + plan.trialDays);

    return this.prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.upsert({
        where: { organizationId },
        update: {
          planId,
          status: SubscriptionStatus.trialing,
          trialEndsAt,
          nextBillingDate: trialEndsAt,
        },
        create: {
          organizationId,
          planId,
          status: SubscriptionStatus.trialing,
          trialEndsAt,
          nextBillingDate: trialEndsAt,
        },
      });

      await tx.organization.update({
        where: { id: organizationId },
        data: { planId },
      });

      return sub;
    });
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(organizationId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (!sub || sub.status === SubscriptionStatus.canceled) {
      throw new BadRequestException('No active subscription to cancel');
    }

    if (sub.paystackSubscriptionCode && sub.paystackEmailToken) {
      // attempt to disable on paystack
      await this.paystack.disableSubscription(sub.paystackSubscriptionCode, sub.paystackEmailToken).catch((err) => {
        this.logger.error(`Failed to disable on Paystack: ${err.message}`);
      });
    }

    return this.prisma.subscription.update({
      where: { organizationId },
      data: {
        status: SubscriptionStatus.canceled,
        nextBillingDate: null,
      },
    });
  }
}
