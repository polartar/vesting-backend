import {
  BadRequestException,
  NotFoundException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Recipe, RecipeStatus } from '@prisma/client';

import { AuthService } from './auth.service';
import { GoogleService } from './google.service';
import { EmailService } from './email.service';

import {
  AuthAcceptInvitationInput,
  AuthEmailLoginInput,
  AuthEmailSingUpInput,
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
import { Wallet } from 'src/wallets/wallets.decorator';
import { WalletEntity } from 'src/wallets/wallets.entity';
import { RecipesService } from 'src/recipe/recipes.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { compareStrings } from 'src/common/utils/helpers';
import { UsersService } from 'src/users/users.service';
import { Platforms } from 'src/common/utils/constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly google: GoogleService,
    private readonly auth: AuthService,
    private readonly user: UsersService,
    private readonly email: EmailService,
    private readonly wallet: WalletsService,
    private readonly recipe: RecipesService,
    private readonly organization: OrganizationsService
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

      const { tokens } = await this.auth.createUser({
        name: userProfile.name,
        email: userProfile.email,
      });

      return tokens;
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
  async signup(@Body() body: AuthEmailSingUpInput) {
    try {
      const code = await this.auth.createAuthCode(
        body.email,
        body.name,
        body.company
      );
      if (!code) {
        throw new BadRequestException(ERROR_MESSAGES.AUTH_FAILURE);
      }

      if (body.platform === Platforms.Portfolio) {
        const { id } = await this.auth.createUser({
          email: body.email,
          name: body.name,
        });

        if (body.company)
          await this.organization.create(body.email, body.company, id);
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
      const auth = await this.auth.validateCode(body.code);
      if (!auth) {
        throw new BadRequestException(ERROR_MESSAGES.AUTH_INVALID_CODE);
      }

      const { tokens } = await this.auth.createUser({
        email: auth.email,
        name: auth.name,
      });

      return tokens;
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
  }

  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/me')
  async me(@User() user: UserEntity, @Wallet() wallet: WalletEntity) {
    return {
      user,
      wallet,
    };
  }

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/accept-invitation')
  async acceptInvitation(@Body() body: AuthAcceptInvitationInput) {
    const recipe = await this.recipe.getByCode(body.code);
    if (!recipe) {
      throw new NotFoundException(ERROR_MESSAGES.RECIPIENT_INVALID_CODE);
    }

    if (recipe.status !== RecipeStatus.PENDING) {
      throw new BadRequestException(ERROR_MESSAGES.RECIPIENT_ALREADY_ACCEPTED);
    }

    const wallet = body.wallet;
    const payload: Partial<Recipe> = {};

    if (!recipe.address && !wallet) {
      throw new BadRequestException(ERROR_MESSAGES.RECIPIENT_REQUIRE_WALLET);
    }

    if (wallet) {
      if (recipe.address && !compareStrings(recipe.address, wallet.address)) {
        throw new BadRequestException(
          ERROR_MESSAGES.RECIPIENT_REQUIRE_CORRECT_WALLET
        );
      }

      const isValidated = this.wallet.validateSignature(
        wallet.signature,
        wallet.address,
        wallet.utcTime
      );

      if (!isValidated) {
        throw new BadRequestException(ERROR_MESSAGES.WALLET_INVALID_SIGNATURE);
      }

      payload.address = wallet.address.toLowerCase();
    }

    // Create user data
    const user = await this.user.createUserIfNotExists(
      recipe.email,
      recipe.name
    );

    const newWallet = await this.wallet.findOrCreate(
      user.id,
      recipe.address || wallet.address
    );

    await this.organization.addVestingMembers({
      organizationId: recipe.organizationId,
      members: [
        {
          userId: user.id,
          organizationId: recipe.organizationId,
          role: recipe.role,
        },
      ],
    });

    payload.status = RecipeStatus.ACCEPTED;
    await this.recipe.acceptInvitation(recipe.id, payload);

    const token = this.auth.generateTokens({
      userId: user.id,
      walletId: newWallet.id,
      walletAddress: newWallet.address,
    });
    return token;
  }
}
