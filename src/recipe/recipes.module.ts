import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  imports: [],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class RecipesModule {}
