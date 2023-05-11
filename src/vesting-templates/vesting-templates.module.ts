import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { VestingTemplatesController } from './vesting-templates.controller';
import { VestingTemplatesService } from './vesting-templates.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  imports: [],
  controllers: [VestingTemplatesController],
  providers: [
    VestingTemplatesService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class VestingTemplatesModule {}
