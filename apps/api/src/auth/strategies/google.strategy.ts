import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, emails, displayName } = profile;
    const avatarUrl = profile.photos?.[0]?.value ?? null;
    // OIDC 프로필 정보 추출
    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: displayName,
      avatarUrl,
    };

    done(null, user);
  }
}
