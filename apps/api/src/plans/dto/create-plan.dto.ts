import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({ example: 'Business' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'For growing businesses' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 20000 })
  @IsNumber()
  @Min(0)
  monthlyPrice!: number;

  @ApiPropertyOptional({ default: false, description: 'If true, plan is free and cannot be paid for' })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @ApiPropertyOptional({ default: true, description: 'If true, users can start a trial on this plan' })
  @IsBoolean()
  @IsOptional()
  trialEnabled?: boolean;

  @ApiPropertyOptional({ default: 30, description: 'Number of days the trial lasts' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  trialDays?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  branchLimit?: number;

  @ApiPropertyOptional({ default: 5 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  staffLimit?: number;

  @ApiPropertyOptional({ default: 2 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  deviceLimit?: number;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasOcr?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasAnalytics?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasExport?: boolean;

  @ApiPropertyOptional({
    type: [String],
    example: ['Priority Support', 'Custom Branding'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  customFeatures?: string[];
}
