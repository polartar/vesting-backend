import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Module({
  imports: [],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    UsersService,
    AuthService,
    WalletsService,
    JwtService,
  ],
})
export class ProjectsModule {}
