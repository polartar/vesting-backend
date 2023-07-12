import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { EmailService } from 'src/auth/email.service';

@Module({
  imports: [],
  controllers: [RecipesController],
  providers: [
    RecipesService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
    EmailService,
  ],
})
export class RecipesModule {}
