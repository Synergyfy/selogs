import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { EntryStatus } from '@prisma/client';

export class CreateEntryDto {
  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  @IsNotEmpty()
  plateNumber!: string;

  @ApiPropertyOptional({ example: '+2348012345678' })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Delivery van' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Gate ID where entry is captured' })
  @IsUUID()
  @IsNotEmpty()
  gateId!: string;

  @ApiPropertyOptional({ description: 'Hardware Device ID' })
  @IsString()
  @IsOptional()
  deviceId?: string;
}

export class CheckoutEntryDto {
  @ApiProperty({ description: 'Gate ID where exit is captured' })
  @IsUUID()
  @IsNotEmpty()
  gateId!: string;
}

export class EntriesQueryDto {
  @ApiPropertyOptional({ description: 'Filter by branch ID' })
  @IsUUID()
  @IsOptional()
  branchId?: string;

  @ApiPropertyOptional({ description: 'Filter by staff ID' })
  @IsUUID()
  @IsOptional()
  staffId?: string;

  @ApiPropertyOptional({ description: 'Search by plate number' })
  @IsString()
  @IsOptional()
  plateNumber?: string;

  @ApiPropertyOptional({ enum: EntryStatus })
  @IsEnum(EntryStatus)
  @IsOptional()
  status?: EntryStatus;

  @ApiPropertyOptional({ description: 'Start date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  limit?: number;
}

export class EntryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  plateNumber!: string;

  @ApiPropertyOptional()
  phoneNumber?: string | null;

  @ApiPropertyOptional()
  notes?: string | null;

  @ApiProperty({ enum: EntryStatus })
  status!: EntryStatus;

  @ApiProperty()
  checkInTime!: Date;

  @ApiPropertyOptional()
  checkOutTime?: Date | null;

  @ApiProperty()
  branchName!: string;

  @ApiProperty()
  checkInStaffName!: string;

  @ApiPropertyOptional()
  checkOutStaffName?: string | null;

  @ApiProperty()
  checkInGateName!: string;

  @ApiPropertyOptional()
  checkOutGateName?: string | null;

  @ApiPropertyOptional()
  imagePath?: string | null;

  @ApiProperty()
  createdAt!: Date;
}

export class PaginatedEntriesResponseDto {
  @ApiProperty({ type: [EntryResponseDto] })
  data!: EntryResponseDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  lastPage!: number;
}
