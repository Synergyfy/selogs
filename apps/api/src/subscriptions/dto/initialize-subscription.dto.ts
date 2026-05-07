import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export enum BillingCycle {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export class InitializeSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  planId!: string;

  @IsEnum(BillingCycle)
  @IsNotEmpty()
  billingCycle!: BillingCycle;
}
