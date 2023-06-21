import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { UsersService } from './users.service';

import { UsersController } from './user.controller';

@Module({
  imports: [],
  providers: [AuthService, UsersService, WalletsService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}
