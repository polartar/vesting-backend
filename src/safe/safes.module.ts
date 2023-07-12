import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from 'src/auth/auth.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/auth/email.service';
import { SafesService } from './safes.service';

import { SafesController } from './safes.controller';

@Module({
  imports: [],
  providers: [
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
    EmailService,
    SafesService,
  ],
  controllers: [SafesController],
})
export class SafesModule {}
