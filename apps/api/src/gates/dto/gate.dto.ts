import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GateType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateGateDto {
  @ApiProperty({ example: 'Main Gate' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ enum: GateType, default: GateType.BOTH })
  @IsEnum(GateType)
  @IsOptional()
  type?: GateType;

  @ApiProperty({ example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6' })
  @IsUUID()
  @IsNotEmpty()
  branchId!: string;
}

export class UpdateGateDto {
  @ApiPropertyOptional({ example: 'Back Gate' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: GateType })
  @IsEnum(GateType)
  @IsOptional()
  type?: GateType;

  @ApiPropertyOptional({ example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6' })
  @IsUUID()
  @IsOptional()
  branchId?: string;
}

export class GateResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: GateType })
  type!: GateType;

  @ApiProperty()
  branchId!: string;

  @ApiProperty()
  branchName!: string;

  @ApiProperty()
  createdAt!: Date;
}
