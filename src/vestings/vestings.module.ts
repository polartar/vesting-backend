import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { VestingsController } from './vestings.controller';
import { VestingsService } from './vestings.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  imports: [],
  controllers: [VestingsController],
  providers: [
    VestingsService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class VestingsModule {}
