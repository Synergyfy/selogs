import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { BillingCycle } from '@prisma/client';

export class CheckoutDto {
  @ApiProperty({ description: 'The ID of the plan to subscribe to' })
  @IsString()
  planId!: string;

  @ApiProperty({ enum: BillingCycle, description: 'The billing cycle for the subscription' })
  @IsEnum(BillingCycle)
  billingCycle!: BillingCycle;

  @ApiPropertyOptional({ type: [String], description: 'Optional array of Addon IDs to purchase alongside the plan' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  addonIds?: string[];
}
