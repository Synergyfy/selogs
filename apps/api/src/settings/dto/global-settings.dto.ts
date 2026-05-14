import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGlobalSettingsDto {
  @ApiPropertyOptional({ description: 'Enable or disable maintenance mode' })
  @IsBoolean()
  @IsOptional()
  maintenanceMode?: boolean;

  @ApiPropertyOptional({ description: 'Allow new signups' })
  @IsBoolean()
  @IsOptional()
  allowNewSignups?: boolean;

  @ApiPropertyOptional({ description: 'Platform name' })
  @IsString()
  @IsOptional()
  platformName?: string;

  @ApiPropertyOptional({ description: 'Support contact email' })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Support contact phone' })
  @IsString()
  @IsOptional()
  supportPhone?: string;

  @ApiPropertyOptional({ description: 'Global quarterly discount percentage (e.g. 5 for 5%)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  quarterlyDiscount?: number;

  @ApiPropertyOptional({ description: 'Global yearly discount percentage (e.g. 15 for 15%)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  yearlyDiscount?: number;
}
