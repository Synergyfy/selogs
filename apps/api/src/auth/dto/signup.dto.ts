import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'User password (min 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: Role,
    example: Role.admin,
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;

  @ApiPropertyOptional({
    description: 'Name of the organization (required if role is admin)',
    example: 'VGuard Security',
  })
  @IsString()
  @IsOptional()
  organizationName?: string;

  @ApiPropertyOptional({
    description: 'Secret code required to create a super_admin account',
    example: 'super-secret-code',
  })
  @IsString()
  @IsOptional()
  superAdminSecret?: string;
}
