import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  imports: [],
  controllers: [TokensController],
  providers: [
    TokensService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class TokensModule {}
