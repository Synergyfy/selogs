import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto';

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
  async getTokens(userId: string, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
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
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
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

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
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

    if (!user || !user.refreshTokenHash) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.refreshTokenHash);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
