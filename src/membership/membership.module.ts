import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { MembershipsController } from './membership.controller';
import { MembershipService } from './membership.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  imports: [],
  controllers: [MembershipsController],
  providers: [
    MembershipService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class MembershipModule {}
