import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PaystackModule } from '../paystack/paystack.module';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [PaystackModule, PlansModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
