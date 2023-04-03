import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { GOOGLE_AUTH_SCOPES } from 'src/common/utils/constants';

@Injectable()
export class GoogleService {
  oauth2Client;

  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.AUTH_URL}/google`
    );
  }

  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',

      // If you only need one scope you can pass it as a string
      scope: GOOGLE_AUTH_SCOPES,
    });
  }

  async getAuthTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    if (tokens.expiry_date <= new Date().getTime()) {
      return false;
    }

    this.oauth2Client.setCredentials(tokens);
    const googleAuth = google.oauth2({
      version: 'v2',
      auth: this.oauth2Client,
    });

    const googleUserInfo = await googleAuth.userinfo.get();
    const email = googleUserInfo.data.email;
    const firstName = googleUserInfo.data.given_name;
    const lastName = googleUserInfo.data.family_name;
    return {
      email,
      name: `${firstName} ${lastName}`,
    };
  }
}
