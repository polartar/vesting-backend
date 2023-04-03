import { PrismaService } from 'nestjs-prisma';
import { Prisma, User } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { SecurityConfig } from 'src/common/configs/config.interface';
import { SignupInput } from './dto/signup.input';
import { Token } from './models/token.model';
import { generateRandomCode } from 'src/common/utils/helpers';
import { AUTHORIZATION_CODE_EXPIRE_TIME } from 'src/common/utils/constants';

const getExpiredTime = () =>
  new Date().getTime() + AUTHORIZATION_CODE_EXPIRE_TIME;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  async createUser(payload: SignupInput): Promise<Token> {
    try {
      const user = await this.prisma.user.upsert({
        where: {
          email: payload.email,
        },
        create: payload,
        update: {},
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async login(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });

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

  generateTokens(payload: { userId: string }): Token {
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

  async createAuthCode(email: string): Promise<string> {
    const auth = await this.prisma.auth.findUnique({
      where: {
        email,
      },
    });

    if (auth) {
      await this.prisma.auth.update({
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
    await this.prisma.auth.create({
      data: {
        email,
        code,
        expiredAt: getExpiredTime(),
      },
    });
    return code;
  }

  async validateCode(email: string, code: string): Promise<boolean> {
    try {
      const auth = await this.prisma.auth.findFirst({
        where: {
          email,
          code,
        },
      });
      return Boolean(auth);
    } catch (error) {
      return false;
    }
  }
}
