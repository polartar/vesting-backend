import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { VestingContractsService } from 'src/vesting-contracts/vesting-contracts.service';

@Module({
  imports: [],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
    VestingContractsService,
  ],
})
export class TransactionsModule {}
