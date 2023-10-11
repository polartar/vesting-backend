import { Module } from '@nestjs/common';
import { MilestoneVestingTemplateService } from './milestone-vesting-template.service';
import { MilestoneVestingTemplateController } from './milestone-vesting-template.controller';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    MilestoneVestingTemplateService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
  controllers: [MilestoneVestingTemplateController],
})
export class MilestoneVestingTemplateModule {}
