import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { WebsiteController } from './websites.controller';
import { WebsiteService } from './websites.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  imports: [],
  controllers: [WebsiteController],
  providers: [
    WebsiteService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class WebsiteModule {}
