import { Body, Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { CreateMembershipInput } from './dto/membership.input';

@Controller('membership')
export class MembershipsController {
  constructor(private readonly membership: MembershipService) {}

  @ApiBearerAuth()
  @AdminAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createMembership(@Body() body: CreateMembershipInput) {
    const membership = await this.membership.create(body.organizationId);
    return membership;
  }

  @ApiBearerAuth()
  @AdminAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/')
  async getMemberships(@Query('organizationId') organizationId: string) {
    return await this.membership.getMemberShips(organizationId);
  }
}
