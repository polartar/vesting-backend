import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationFounderAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { CreateMembershipInput } from './dto/membership.input';

@Controller('membership')
export class MembershipsController {
  constructor(private readonly membership: MembershipService) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createMembership(@Body() body: CreateMembershipInput) {
    const membership = await this.membership.create(body.organizationId);
    return membership;
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/organizationId/:organizationId')
  async getMemberships(@Param('organizationId') organizationId: string) {
    return await this.membership.getMemberShips(organizationId);
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Delete('/:organizationId/:membershipId')
  async deleteMembership(@Param('membershipId') membershipId: string) {
    return await this.membership.deleteMembership(membershipId);
  }
}
