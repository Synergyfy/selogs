import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Hashes data using bcrypt.
   */
  async hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  /**
   * Generates Access and Refresh tokens for a user.
   */
  /**
   * Generates Access and Refresh tokens for a user.
   */
  async getTokens(
    userId: string,
    email: string,
    role: string,
    organizationId?: string | null,
    branchId?: string | null,
  ) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
          organizationId,
          branchId,
        },
        {
          secret: this.config.get<string>('JWT_SECRET')!,
          expiresIn: this.config.get<string>('JWT_EXPIRES_IN') as any,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
          organizationId,
          branchId,
        },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET')!,
          expiresIn: this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') as any,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  /**
   * Updates the hashed refresh token in the database.
   */
  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: hash,
      },
    });
  }

  /**
   * Signs up a new user.
   */
  async signup(dto: SignupDto) {
    // 1. Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('User already exists');

    // 2. Validate Super Admin creation
    if (dto.role === Role.super_admin) {
      const secret = this.config.get<string>('SUPER_ADMIN_SECRET');
      if (!dto.superAdminSecret || dto.superAdminSecret !== secret) {
        throw new ForbiddenException('Invalid Super Admin secret code');
      }
    }

    // 3. Handle Admin signup (Organization creation)
    let organizationId: string | undefined;
    if (dto.role === Role.admin) {
      if (!dto.organizationName) {
        throw new BadRequestException(
          'Organization name is required for admin signup',
        );
      }

      // Generate a unique 6-character code for the organization
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      const organization = await this.prisma.organization.create({
        data: {
          name: dto.organizationName,
          code,
          industry: dto.organizationType,
          branches: dto.mainLocation ? {
            create: {
              name: dto.mainLocation,
              code: Math.random().toString(36).substring(2, 10).toUpperCase(),
            }
          } : undefined,
        },
      });
      organizationId = organization.id;
    }

    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hash,
        role: dto.role,
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        organizationId: organizationId,
      },
    });

    const tokens = await this.getTokens(
      newUser.id,
      newUser.email,
      newUser.role,
      newUser.organizationId,
      newUser.branchId,
    );
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  /**
   * Logs in an existing user.
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.organizationId,
      user.branchId,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  /**
   * Logs out a user by clearing their refresh token hash.
   */
  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshTokenHash: {
          not: null,
        },
      },
      data: {
        refreshTokenHash: null,
      },
    });
  }

  /**
   * Refreshes access and refresh tokens.
   */
  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshTokenHash);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.organizationId,
      user.branchId,
    );
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  /**
   * Generates a password reset token and sends it to the user.
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // TODO: Send email with reset token
    return { message: 'Password reset link sent to email' };
  }

  /**
   * Resets the user's password using the token.
   */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) throw new BadRequestException('Invalid or expired reset token');

    const passwordHash = await this.hashData(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  /**
   * Verifies the user's account using an OTP.
   */
  async verifyAccount(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        otpCode: dto.otpCode,
        otpExpiry: { gt: new Date() },
      },
    });

    if (!user) throw new BadRequestException('Invalid or expired OTP');

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiry: null,
      },
    });

    return { message: 'Account verified successfully' };
  }
}
