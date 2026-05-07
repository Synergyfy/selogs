import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'Unique hardware identifier (e.g., UUID or IMEI)',
    example: 'DEV-LAG-SEC-001',
  })
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiPropertyOptional({
    description: 'Friendly name for the device',
    example: 'Main Entrance Handheld',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Branch ID the device belongs to',
    example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
  })
  @IsUUID()
  @IsNotEmpty()
  branchId!: string;

  @ApiProperty({
    description: 'Gate ID the device is assigned to',
    example: 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5v6',
  })
  @IsUUID()
  @IsNotEmpty()
  gateId!: string;
}

export class UpdateDeviceDto {
  @ApiPropertyOptional({ example: 'Updated Device Name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6' })
  @IsUUID()
  @IsOptional()
  branchId?: string;

  @ApiPropertyOptional({ example: 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5v6' })
  @IsUUID()
  @IsOptional()
  gateId?: string;
}

export class DeviceResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  deviceId!: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  branchName!: string;

  @ApiProperty()
  gateId!: string;

  @ApiProperty()
  gateName!: string;

  @ApiPropertyOptional()
  lastActive?: Date;

  @ApiProperty()
  createdAt!: Date;
}
