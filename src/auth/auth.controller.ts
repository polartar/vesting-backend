import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { GoogleService } from './google.service';
import { EmailService } from './email.service';

import {
  AuthGoogleLoginInput,
  AuthInput,
  AuthValidationInput,
} from './dto/login.input';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/messages';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly google: GoogleService,
    private readonly auth: AuthService,
    private readonly email: EmailService
  ) {}

  @Get('/google-callback')
  async googleAuthUrl() {
    return this.google.getAuthUrl();
  }

  @Post('/google-login')
  async googleAuthLogin(@Body() body: AuthGoogleLoginInput) {
    try {
      const userProfile = await this.google.getAuthTokens(body.code);
      if (!userProfile) {
        return new BadRequestException(ERROR_MESSAGES.GOOGLE_AUTH_FAILURE);
      }

      return this.auth.createUser({
        name: userProfile.name,
        email: userProfile.email,
      });
    } catch (error) {
      return new BadRequestException(ERROR_MESSAGES.GOOGLE_AUTH_FAILURE);
    }
  }

  @Post('/login')
  async login(@Body() body: AuthInput) {
    try {
      const code = await this.auth.login(body.email);
      if (!code) {
        return new BadRequestException(ERROR_MESSAGES.AUTH_FAILURE);
      }

      const sent = await this.email.sendLoginEmail(body.email, code);
      if (sent) {
        return SUCCESS_MESSAGES.LOGIN_EMAIL;
      }

      return new BadRequestException(ERROR_MESSAGES.EMAIL_SEND_FAILURE);
    } catch (error) {
      return new BadRequestException(ERROR_MESSAGES.AUTH_FAILURE);
    }
  }

  @Post('/signup')
  async signup(@Body() body: AuthInput) {
    try {
      const code = await this.auth.createAuthCode(body.email);
      if (!code) {
        return new BadRequestException(ERROR_MESSAGES.AUTH_FAILURE);
      }

      const sent = await this.email.sendLoginEmail(body.email, code);
      if (sent) {
        return SUCCESS_MESSAGES.SIGNUP_EMAIL;
      }

      return new BadRequestException(ERROR_MESSAGES.EMAIL_SEND_FAILURE);
    } catch (error) {
      console.error(error);
      return new BadRequestException(ERROR_MESSAGES.AUTH_FAILURE);
    }
  }

  @Post('/validate')
  async validate(@Body() body: AuthValidationInput) {
    try {
      const isValidated = await this.auth.validateCode(body.email, body.code);
      if (!isValidated) {
        return new BadRequestException(ERROR_MESSAGES.AUTH_INVALID_CODE);
      }

      return this.auth.createUser({
        email: body.email,
      });
    } catch (error) {
      return new BadRequestException(ERROR_MESSAGES.AUTH_INVALID_CODE);
    }
  }
}
