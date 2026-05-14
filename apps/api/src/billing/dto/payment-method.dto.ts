import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddPaymentMethodDto {
  @ApiProperty({ example: 'PRV_123456', description: 'Paystack transaction reference' })
  @IsString()
  @IsNotEmpty()
  reference!: string;
}

export class PaymentMethodResponseDto {
  @ApiProperty()
  brand!: string;

  @ApiProperty()
  last4!: string;

  @ApiProperty()
  expMonth!: number;

  @ApiProperty()
  expYear!: number;

  @ApiProperty()
  isDefault!: boolean;
}
