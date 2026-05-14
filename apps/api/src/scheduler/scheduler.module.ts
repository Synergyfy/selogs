import { Module } from '@nestjs/common';
import { SubscriptionExpiryJob } from './subscription-expiry.job';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SubscriptionExpiryJob],
})
export class SchedulerModule {}
