import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
}
