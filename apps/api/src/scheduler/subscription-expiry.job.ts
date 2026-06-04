import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionExpiryJob {
  private readonly logger = new Logger(SubscriptionExpiryJob.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiries() {
    this.logger.log('Running subscription expiry check...');
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // 1. Handle Expired Trials
    const expiredTrials = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.trialing,
        trialEndsAt: { lt: now },
      },
      select: { organizationId: true },
    });

    for (const sub of expiredTrials) {
      await this.notifications.create({
        organizationId: sub.organizationId,
        type: 'alert',
        title: 'Trial Expired',
        message: 'Your trial period has ended. Please subscribe to a plan to continue using VGuard.',
        priority: 'high',
      });
    }

    if (expiredTrials.length > 0) {
      await this.prisma.subscription.updateMany({
        where: {
          status: SubscriptionStatus.trialing,
          trialEndsAt: { lt: now },
        },
        data: { status: SubscriptionStatus.canceled },
      });
      this.logger.log(`Expired ${expiredTrials.length} trials.`);
    }

    // 2. Notify about trials ending in 3 days
    const endingTrials = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.trialing,
        trialEndsAt: {
          gte: now,
          lte: threeDaysFromNow,
        },
      },
      select: { organizationId: true, trialEndsAt: true },
    });

    for (const sub of endingTrials) {
      const daysLeft = Math.ceil(
        (sub.trialEndsAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      await this.notifications.create({
        organizationId: sub.organizationId,
        type: 'alert',
        title: 'Trial Ending Soon',
        message: `Your free trial will expire in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Subscribe now to avoid service interruption.`,
        priority: 'high',
      });
    }

    if (endingTrials.length > 0) {
      this.logger.log(`Sent trial-ending reminders to ${endingTrials.length} organizations.`);
    }

    // 3. Handle Past Due subscriptions that are too old (7-day grace period)
    const gracePeriod = new Date();
    gracePeriod.setDate(gracePeriod.getDate() - 7);

    const expiredPastDue = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.past_due,
        updatedAt: { lt: gracePeriod },
      },
      select: { organizationId: true },
    });

    for (const sub of expiredPastDue) {
      await this.notifications.create({
        organizationId: sub.organizationId,
        type: 'alert',
        title: 'Subscription Canceled',
        message: 'Your subscription has been canceled due to non-payment. Please contact support to reinstate your account.',
        priority: 'high',
      });
    }

    if (expiredPastDue.length > 0) {
      await this.prisma.subscription.updateMany({
        where: {
          status: SubscriptionStatus.past_due,
          updatedAt: { lt: gracePeriod },
        },
        data: { status: SubscriptionStatus.canceled },
      });
      this.logger.log(`Canceled ${expiredPastDue.length} past due subscriptions after grace period.`);
    }

    // 4. Notify about subscriptions expiring in 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringSubs = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.active,
        nextBillingDate: {
          gte: now,
          lte: sevenDaysFromNow,
        },
      },
      select: { organizationId: true, nextBillingDate: true },
    });

    for (const sub of expiringSubs) {
      const daysLeft = Math.ceil(
        (sub.nextBillingDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      await this.notifications.create({
        organizationId: sub.organizationId,
        type: 'alert',
        title: 'Subscription Renewal Soon',
        message: `Your subscription will renew in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Ensure your payment method is up to date.`,
        priority: 'medium',
      });
    }

    this.logger.log('Subscription expiry check complete.');
  }
}
