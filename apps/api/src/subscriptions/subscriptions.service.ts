import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaystackService } from '../paystack/paystack.service';
import { PlansService } from '../plans/plans.service';
import { InitializeSubscriptionDto, BillingCycle } from './dto/initialize-subscription.dto';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paystack: PaystackService,
    private readonly plansService: PlansService,
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

    return {
      subscription: org.subscription,
      activePlan,
      usage: {
        branches: {
          used: branchCount,
          limit: activePlan?.branchLimit || 0,
        },
        staff: {
          used: staffCount,
          limit: activePlan?.staffLimit || 0,
        },
        devices: {
          used: deviceCount,
          limit: activePlan?.deviceLimit || 0,
        },
      },
    };
  }

  /**
   * Initialize a new subscription or upgrade
   */
  async initializeSubscription(organizationId: string, email: string, dto: InitializeSubscriptionDto) {
    const plan = await this.plansService.findOne(dto.planId);
    
    let amount = plan.monthlyPrice;
    if (dto.billingCycle === BillingCycle.QUARTERLY) amount = plan.quarterlyPrice || plan.monthlyPrice * 3;
    if (dto.billingCycle === BillingCycle.YEARLY) amount = plan.yearlyPrice || plan.monthlyPrice * 12;

    const metadata = {
      organizationId,
      planId: plan.id,
      billingCycle: dto.billingCycle,
    };

    const result = await this.paystack.initializeTransaction(email, amount, metadata);
    return result;
  }

  /**
   * Verify subscription payment and update organization status
   */
  async verifySubscription(organizationId: string, reference: string) {
    const verification = await this.paystack.verifyTransaction(reference) as any;
    
    if (verification.data.status !== 'success') {
      throw new BadRequestException('Payment verification failed');
    }

    const { planId, billingCycle } = verification.data.metadata;
    const amount = verification.data.amount / 100; // back to NGN

    return await this.prisma.$transaction(async (tx) => {
      // 1. Create Invoice record
      await tx.invoice.create({
        data: {
          organizationId,
          amount,
          status: 'paid',
          paystackReference: reference,
          paidAt: new Date(verification.data.paid_at),
          paymentMethod: `${verification.data.authorization.brand} **** ${verification.data.authorization.last4}`,
        },
      });

      // 2. Update or Create Subscription
      const nextBillingDate = this.calculateNextBillingDate(new Date(), billingCycle);

      const subscription = await tx.subscription.upsert({
        where: { organizationId },
        update: {
          planId,
          status: SubscriptionStatus.active,
          nextBillingDate,
          updatedAt: new Date(),
        },
        create: {
          organizationId,
          planId,
          status: SubscriptionStatus.active,
          nextBillingDate,
        },
      });

      // 3. Sync planId on Organization model for quick access
      await tx.organization.update({
        where: { id: organizationId },
        data: { planId },
      });

      return subscription;
    });
  }

  private calculateNextBillingDate(startDate: Date, cycle: BillingCycle): Date {
    const date = new Date(startDate);
    if (cycle === BillingCycle.MONTHLY) date.setMonth(date.getMonth() + 1);
    else if (cycle === BillingCycle.QUARTERLY) date.setMonth(date.getMonth() + 3);
    else if (cycle === BillingCycle.YEARLY) date.setFullYear(date.getFullYear() + 1);
    return date;
  }
}
