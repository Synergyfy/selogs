import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSystemSettingsDto {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  enableNotes?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  enablePhoneNumber?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  ocrEnabled?: boolean;
}
