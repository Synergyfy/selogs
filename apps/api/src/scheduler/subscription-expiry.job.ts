import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionExpiryJob {
  private readonly logger = new Logger(SubscriptionExpiryJob.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiries() {
    this.logger.log('Running subscription expiry check...');
    const now = new Date();

    // 1. Handle Expired Trials
    const expiredTrials = await this.prisma.subscription.updateMany({
      where: {
        status: SubscriptionStatus.trialing,
        trialEndsAt: { lt: now },
      },
      data: {
        status: SubscriptionStatus.canceled,
      },
    });

    if (expiredTrials.count > 0) {
      this.logger.log(`Expired ${expiredTrials.count} trials.`);
    }

    // 2. Handle Past Due subscriptions that are too old (e.g., 7 days grace)
    const gracePeriod = new Date();
    gracePeriod.setDate(gracePeriod.getDate() - 7);

    const expiredPastDue = await this.prisma.subscription.updateMany({
      where: {
        status: SubscriptionStatus.past_due,
        updatedAt: { lt: gracePeriod },
      },
      data: {
        status: SubscriptionStatus.canceled,
      },
    });

    if (expiredPastDue.count > 0) {
      this.logger.log(`Canceled ${expiredPastDue.count} past due subscriptions after grace period.`);
    }

    this.logger.log('Subscription expiry check complete.');
  }
}
