import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
    },
    organization: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'JWT_SECRET': return 'jwtSecret';
        case 'JWT_EXPIRES_IN': return '15m';
        case 'REFRESH_TOKEN_SECRET': return 'rtSecret';
        case 'REFRESH_TOKEN_EXPIRES_IN': return '7d';
        case 'SUPER_ADMIN_SECRET': return 'secret';
        default: return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('forgotPassword', () => {
    it('should generate token and update user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com' });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.forgotPassword({ email: 'test@test.com' });
      
      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result.message).toBe('Password reset link sent to email');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.forgotPassword({ email: 'notfound@test.com' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({ id: '1' });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.resetPassword({ token: 'valid-token', newPassword: 'password123' });

      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result.message).toBe('Password reset successful');
    });

    it('should throw BadRequestException with invalid token', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.resetPassword({ token: 'invalid-token', newPassword: 'password123' }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyAccount', () => {
    it('should verify account with valid OTP', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue({ id: '1' });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.verifyAccount({ email: 'test@test.com', otpCode: '123456' });

      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result.message).toBe('Account verified successfully');
    });

    it('should throw BadRequestException with invalid OTP', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.verifyAccount({ email: 'test@test.com', otpCode: 'wrong' }))
        .rejects.toThrow(BadRequestException);
    });
  });
});
