import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateStaffDto {
  @ApiProperty({ example: 'staff@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiPropertyOptional({
    example: 'S12345',
    description: 'Unique alphanumeric staff ID (Auto-generated if not provided)',
  })
  @IsString()
  @IsOptional()
  staffId?: string;

  @ApiProperty({ enum: Role, example: Role.guard })
  @IsEnum(Role)
  role!: Role;

  @ApiPropertyOptional({ example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6' })
  @IsUUID()
  @IsOptional()
  branchId?: string;
}

export class UpdateStaffDto {
  @ApiPropertyOptional({ example: 'John Updated' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.supervisor })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({ example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6' })
  @IsUUID()
  @IsOptional()
  branchId?: string;
}

export class StaffResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  fullName?: string;

  @ApiProperty()
  staffId?: string;

  @ApiProperty({ enum: Role })
  role!: Role;

  @ApiPropertyOptional()
  branchId?: string;

  @ApiPropertyOptional()
  branchName?: string;

  @ApiProperty()
  createdAt!: Date;
}

export class StaffCheckInDto {
  @ApiProperty({ example: 'S12345' })
  @IsString()
  @IsNotEmpty()
  staffId!: string;

  @ApiPropertyOptional({ example: 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4u5v6' })
  @IsUUID()
  @IsOptional()
  gateId?: string;

  @ApiProperty({ example: 'DEV-001' })
  @IsString()
  @IsNotEmpty()
  deviceId!: string;
}

export class ShiftResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  staffId!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  branchName!: string;

  @ApiProperty()
  startTime!: Date;

  @ApiPropertyOptional()
  endTime?: Date;

  @ApiPropertyOptional()
  deviceName?: string;
}
