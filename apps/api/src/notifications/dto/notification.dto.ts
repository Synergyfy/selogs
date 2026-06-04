import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  organizationId!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  priority!: string;

  @ApiProperty()
  read!: boolean;

  @ApiProperty()
  createdAt!: Date;
}

export class MarkReadDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notificationId?: string;
}

export class BroadcastNotificationDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  message!: string;

  @ApiProperty({ default: 'system' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ default: 'medium' })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiProperty({ oneOf: [
    { type: 'string', example: 'all' },
    { type: 'array', items: { type: 'string' } },
  ]})
  target!: 'all' | string[];
}
