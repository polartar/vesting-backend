import { Module } from '@nestjs/common';
import { MilestoneVestingController } from './milestone-vesting.controller';
import { MilestoneVestingService } from './milestone-vesting.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { JwtService } from '@nestjs/jwt';
import { RecipesService } from 'src/recipe/recipes.service';
import { EmailService } from 'src/auth/email.service';
import { TokensService } from 'src/tokens/tokens.service';
import { ListenerService } from 'src/listener/listener.service';

@Module({
  controllers: [MilestoneVestingController],
  providers: [
    MilestoneVestingService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
    RecipesService,
    WalletsService,
    EmailService,
    TokensService,
    ListenerService,
  ],
})
export class MilestoneVestingModule {}
