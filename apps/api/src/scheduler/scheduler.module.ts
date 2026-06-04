import { Module } from '@nestjs/common';
import { SubscriptionExpiryJob } from './subscription-expiry.job';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [SubscriptionExpiryJob],
})
export class SchedulerModule {}
