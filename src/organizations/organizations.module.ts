import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { OrganizationsService } from './organizations.service';
import { AuthService } from 'src/auth/auth.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { EmailService } from 'src/auth/email.service';
import { EntitiesService } from 'src/entities/entities.service';

import { OrganizationsController } from './organizations.controller';

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
    WalletsService,
    EntitiesService,
  ],
})
export class OrganizationsModule {}
