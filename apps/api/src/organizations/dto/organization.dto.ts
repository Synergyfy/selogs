import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class OrganizationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  industry!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  planName?: string;

  @ApiProperty()
  branchCount!: number;

  @ApiProperty()
  staffCount!: number;

  @ApiProperty()
  deviceCount!: number;
}

export class UpdateOrganizationDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  ocrEnabled?: boolean;
}
