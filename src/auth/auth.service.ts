import { PrismaService } from 'nestjs-prisma';
import { EmailVerification, User, Wallet } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { SecurityConfig } from 'src/common/configs/config.interface';
import { SignupInput } from './dto/signup.input';
import { TokenPayload } from './dto/jwt.dto';
import { Token } from './models/token.model';
import { generateRandomCode } from 'src/common/utils/helpers';
import { getExpiredTime } from 'src/common/utils/helper';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private generateAccessToken(payload: {
    userId: string;
    walletAddressId?: string;
  }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: {
    userId: string;
    walletAddressId?: string;
  }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  async createUser(
    payload: SignupInput
  ): Promise<{ id: string; tokens: Token }> {
    try {
      const user = await this.prisma.user.upsert({
        where: {
          email: payload.email,
        },
        create: payload,
        update: {},
      });

      const tokens = await this.generateTokens({
        userId: user.id,
      });

      return {
        id: user.id,
        tokens,
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async login(email: string): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const code = await this.createAuthCode(user.email);
    return code;
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  getWalletFromToken(token: string): Promise<Wallet> {
    const id = this.jwtService.decode(token)['walletId'];
    return this.prisma.wallet.findUnique({ where: { id } });
  }

  generateTokens(payload: {
    userId: string;
    walletId?: string;
    walletAddress?: string;
  }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  decodeToken(token: string): TokenPayload {
    return this.jwtService.decode(token) as TokenPayload;
  }

  async createAuthCode(
    email: string,
    name?: string,
    company?: string
  ): Promise<string> {
    const auth = await this.prisma.emailVerification.findUnique({
      where: {
        email,
      },
    });
    const code = generateRandomCode();

    if (auth) {
      await this.prisma.emailVerification.update({
        where: {
          id: auth.id,
        },
        data: {
          expiredAt: getExpiredTime(),
          code: auth.expiredAt > 0 ? auth.code : code,
        },
      });

      return auth.expiredAt > 0 ? auth.code : code;
    }

    await this.prisma.emailVerification.create({
      data: {
        email,
        code,
        name,
        company,
        expiredAt: getExpiredTime(),
      },
    });
    return code;
  }

  async validateCode(code: string): Promise<EmailVerification> {
    let auth;
    try {
      auth = await this.prisma.emailVerification.findFirst({
        where: {
          code,
        },
      });
    } catch (err) {
      return;
    }

    if (Number(auth.expiredAt) == 0) {
      throw new BadRequestException(ERROR_MESSAGES.CODE_ALREADY_USED);
    } else if (new Date().getTime() > auth.expiredAt) {
      throw new BadRequestException(ERROR_MESSAGES.CODE_EXPIRED);
    }

    await this.prisma.emailVerification.update({
      where: {
        id: auth.id,
      },
      data: {
        expiredAt: 0,
      },
    });

    const updateQuery = {
      where: {
        isAccepted: false,
        user: {
          email: auth.email,
        },
      },
      data: { isAccepted: true },
    };
    await Promise.all([
      this.prisma.userRole.updateMany(updateQuery),
      this.prisma.userPermission.updateMany(updateQuery),
    ]);
    return auth;
  }
}
