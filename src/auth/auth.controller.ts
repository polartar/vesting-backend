import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { GoogleService } from './google.service';
import { EmailService } from './email.service';

import {
  AuthEmailLoginInput,
  AuthGoogleLoginInput,
  AuthInput,
  AuthValidationInput,
} from './dto/login.input';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/messages';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { NormalAuth, PublicAuth } from 'src/common/utils/auth';
import { WalletsService } from 'src/wallets/wallets.service';
import { ConnectWalletInput } from './dto/wallet.input';
import { User } from 'src/users/users.decorator';
import { UserEntity } from 'src/users/users.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly google: GoogleService,
    private readonly auth: AuthService,
    private readonly email: EmailService,
    private readonly wallet: WalletsService
  ) {}

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/google-callback')
  async googleAuthUrl(@Body() body: AuthInput) {
    try {
      return this.google.getAuthUrl(body.redirectUri);
    } catch (error) {
      console.error('Error: /auth/google-callback', error);
      throw new BadRequestException(ERROR_MESSAGES.GOOGLE_AUTH_FAILURE);
    }
  }

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/google-login')
  async googleAuthLogin(@Body() body: AuthGoogleLoginInput) {
    try {
      const userProfile = await this.google.getAuthTokens(
        body.code,
        body.redirectUri
      );
      if (!userProfile) {
        throw new BadRequestException(ERROR_MESSAGES.GOOGLE_AUTH_FAILURE);
      }

      return this.auth.createUser({
        name: userProfile.name,
        email: userProfile.email,
      });
    } catch (error) {
      console.error('Error: /auth/google-login', error);
      throw new BadRequestException(ERROR_MESSAGES.GOOGLE_AUTH_FAILURE);
    }
  }

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/login')
  async login(@Body() body: AuthEmailLoginInput) {
    try {
      const code = await this.auth.login(body.email);
      if (!code) {
        throw new BadRequestException(ERROR_MESSAGES.AUTH_USER_NOT_FOUND);
      }

      const sent = await this.email.sendLoginEmail(
        body.email,
        code,
        body.redirectUri,
        body.platform
      );
      if (sent) {
        return SUCCESS_MESSAGES.LOGIN_EMAIL;
      }

      throw new BadRequestException(ERROR_MESSAGES.EMAIL_SEND_FAILURE);
    } catch (error) {
      console.error('Error: /auth/login', error);
      throw new BadRequestException(ERROR_MESSAGES.AUTH_FAILURE);
    }
  }

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/signup')
  async signup(@Body() body: AuthEmailLoginInput) {
    try {
      const code = await this.auth.createAuthCode(body.email);
      if (!code) {
        throw new BadRequestException(ERROR_MESSAGES.AUTH_FAILURE);
      }

      const sent = await this.email.sendLoginEmail(
        body.email,
        code,
        body.redirectUri,
        body.platform
      );
      if (sent) {
        return SUCCESS_MESSAGES.SIGNUP_EMAIL;
      }

      throw new BadRequestException(ERROR_MESSAGES.EMAIL_SEND_FAILURE);
    } catch (error) {
      console.error('Error: /auth/signup', error);
      throw new BadRequestException(ERROR_MESSAGES.AUTH_FAILURE);
    }
  }

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/validate')
  async validate(@Body() body: AuthValidationInput) {
    try {
      const authEmail = await this.auth.validateCode(body.code);
      if (!authEmail) {
        throw new BadRequestException(ERROR_MESSAGES.AUTH_INVALID_CODE);
      }

      return this.auth.createUser({
        email: authEmail,
      });
    } catch (error) {
      console.error('Error: /auth/validate', error);
      throw new BadRequestException(ERROR_MESSAGES.AUTH_INVALID_CODE);
    }
  }

  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/wallet')
  async connectWallet(
    @Body() body: ConnectWalletInput,
    @User() user: UserEntity
  ) {
    try {
      const isValidated = this.wallet.validateSignature(
        body.signature,
        body.address,
        body.utcTime
      );

      if (!isValidated) {
        throw new BadRequestException(ERROR_MESSAGES.WALLET_INVALID_SIGNATURE);
      }

      const wallet = await this.wallet.findOrCreate(user.id, body.address);

      return this.auth.generateTokens({
        userId: user.id,
        walletId: wallet.id,
        walletAddress: wallet.address,
      });
    } catch (error) {
      console.error('Error: /auth/wallet', error);
      throw new BadRequestException(ERROR_MESSAGES.WALLET_CONNECT_FAILTURE);
    }
  }
}
