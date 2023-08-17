import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RevokingsController } from './revokings.controller';
import { RevokingsService } from './revokings.service';
import { RecipesService } from 'src/recipe/recipes.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { EmailService } from 'src/auth/email.service';

@Module({
  imports: [],
  controllers: [RevokingsController],
  providers: [
    RevokingsService,
    EmailService,
    RecipesService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class RevokingsModule {}
