import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({
    description: 'Name of the branch',
    example: 'Main Gate Branch',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: 'Physical address of the branch',
    example: '123 Security Ave, Lagos',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'Unique branch code for device connection. Auto-generated if not provided.',
    example: 'BR-LAG-001',
  })
  @IsString()
  @IsOptional()
  code?: string;
}

export class UpdateBranchDto {
  @ApiPropertyOptional({
    description: 'Name of the branch',
    example: 'Main Gate Branch Updated',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Physical address of the branch',
    example: '456 Safe Road, Abuja',
  })
  @IsString()
  @IsOptional()
  address?: string;
}

export class BranchResponseDto {
  @ApiProperty({ example: 'a3f2c1d0-4e5b-6789-abcd-ef0123456789' })
  id!: string;

  @ApiProperty({ example: 'Main Gate Branch' })
  name!: string;

  @ApiPropertyOptional({ example: '123 Security Ave, Lagos' })
  address?: string | null;

  @ApiProperty({ example: 'BR-LAG-001' })
  code!: string;

  @ApiProperty({ example: '2026-05-07T20:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-05-07T20:00:00.000Z' })
  updatedAt!: Date;
}
