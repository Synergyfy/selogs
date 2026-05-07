import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET')!,
      passReqToCallback: true,
    });

  }

  validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) throw new ForbiddenException('Refresh token missing');

    return {
      ...payload,
      refreshToken,
    };
  }
}
