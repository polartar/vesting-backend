import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IndexerController } from './indexer.controller';
import { IndexerService } from './indexer.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { EmailService } from 'src/auth/email.service';

@Module({
  imports: [],
  controllers: [IndexerController],
  providers: [
    IndexerService,
    EmailService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class IndexerModule {}
