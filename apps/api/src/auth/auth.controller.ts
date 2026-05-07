import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto';
import { GetCurrentUser, GetCurrentUserId, Public } from './decorators';
import { RtGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registers a new user and sets the refresh token in an HTTP-only cookie.
   */
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signup(dto);
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  /**
   * Logs in a user and sets the refresh token in an HTTP-only cookie.
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  /**
   * Logs out a user and clears the refresh token cookie.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  /**
   * Refreshes the access token using the refresh token from the cookie.
   */
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  /**
   * Helper to set the refresh token in an HTTP-only cookie.
   */
  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
