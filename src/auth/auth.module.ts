import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { SecurityConfig } from 'src/common/configs/config.interface';
import { AuthController } from './auth.controller';

import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';
import { EmailService } from './email.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { RecipesService } from 'src/recipe/recipes.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { EntitiesService } from 'src/entities/entities.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleService,
    EmailService,
    UsersService,
    WalletsService,
    RecipesService,
    OrganizationsService,
    EntitiesService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
