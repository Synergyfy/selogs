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

  @ApiPropertyOptional({
    example: 10,
    description: 'Percentage discount for quarterly payment',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  quarterlyDiscount?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Percentage discount for yearly payment',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  yearlyDiscount?: number;

  @ApiPropertyOptional({ description: 'Manual override for quarterly price' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quarterlyPrice?: number;

  @ApiPropertyOptional({ description: 'Manual override for yearly price' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  yearlyPrice?: number;

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
