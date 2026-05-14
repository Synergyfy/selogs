import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PurchaseAddonDto {
  @ApiProperty({ description: 'The ID of the addon to purchase' })
  @IsString()
  addonId!: string;
}
