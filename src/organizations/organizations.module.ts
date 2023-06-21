import { Module } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { OrganizationsService } from './organizations.service';
import { AuthService } from 'src/auth/auth.service';

import { OrganizationsController } from './organizations.controller';
import { WalletsService } from 'src/wallets/wallets.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/auth/email.service';

@Module({
  imports: [],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
    EmailService,
  ],
})
export class OrganizationsModule {}
