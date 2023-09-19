import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AdminAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { CreateMembershipInput } from './dto/membership.input';
import { MembershipsService } from './memberships.service';

@Controller('membership')
export class MembershipsController {
  constructor(private readonly membership: MembershipsService) {}

  @ApiBearerAuth()
  @AdminAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createMembership(@Body() body: CreateMembershipInput) {
    const membership = await this.membership.create(body.organizationId);
    return membership;
  }
}
