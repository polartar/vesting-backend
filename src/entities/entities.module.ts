import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EntitiesController } from './entities.controller';
import { EntitiesService } from './entities.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  imports: [],
  controllers: [EntitiesController],
  providers: [
    EntitiesService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class EntitiesModule {}
