import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { AlchemyService } from 'src/alchemy/alchemy.service';
import { ListenerService } from 'src/listener/listener.service';
import { NotificationGateway } from 'src/notification/notification.gateway';

@Module({
  imports: [],
  controllers: [TokensController],
  providers: [
    TokensService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
    AlchemyService,
    ListenerService,
    NotificationGateway,
  ],
})
export class TokensModule {}
