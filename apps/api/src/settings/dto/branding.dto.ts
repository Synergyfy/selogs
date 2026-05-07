import { IsString, IsOptional, IsHexColor, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBrandingDto {
  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ example: '#3B82F6' })
  @IsString()
  @IsOptional()
  @IsHexColor()
  primaryColor?: string;

  @ApiPropertyOptional({ example: '#1E293B' })
  @IsString()
  @IsOptional()
  @IsHexColor()
  secondaryColor?: string;
}
