import { PrismaService } from 'nestjs-prisma';
import { User, Wallet } from '@prisma/client';
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

  async createUser(payload: SignupInput, activate = false): Promise<Token> {
    try {
      let user = await this.prisma.user.upsert({
        where: {
          email: payload.email,
        },
        create: payload,
        update: {},
      });
      if (!user.isActive) {
        if (activate) {
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { isActive: true },
          });
        } else {
          throw new BadRequestException(`Inactive user: ${payload.email}`);
        }
      }

      return this.generateTokens({
        userId: user.id,
      });
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

    if (!user.isActive) {
      throw new NotFoundException(`User is not active: ${email}`);
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

  async createAuthCode(email: string): Promise<string> {
    const auth = await this.prisma.emailVerification.findUnique({
      where: {
        email,
      },
    });

    if (auth) {
      await this.prisma.emailVerification.update({
        where: {
          id: auth.id,
        },
        data: {
          expiredAt: getExpiredTime(),
        },
      });

      return auth.code;
    }

    const code = generateRandomCode();
    await this.prisma.emailVerification.create({
      data: {
        email,
        code,
        expiredAt: getExpiredTime(),
      },
    });
    return code;
  }

  async validateCode(code: string): Promise<string | undefined> {
    try {
      const auth = await this.prisma.emailVerification.findFirst({
        where: {
          code,
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
      return auth.email;
    } catch (error) {
      return;
    }
  }
}
