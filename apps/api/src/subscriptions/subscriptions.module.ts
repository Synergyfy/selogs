import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PaystackModule } from '../paystack/paystack.module';
import { PlansModule } from '../plans/plans.module';
import { CapabilityModule } from '../common/capabilities';

@Module({
  imports: [PaystackModule, PlansModule, CapabilityModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
