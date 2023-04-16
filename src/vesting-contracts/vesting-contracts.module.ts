import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { VestingContractsController } from './vesting-contracts.controller';
import { VestingContractsService } from './vesting-contracts.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  imports: [],
  controllers: [VestingContractsController],
  providers: [
    VestingContractsService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class VestingContractsModule {}
