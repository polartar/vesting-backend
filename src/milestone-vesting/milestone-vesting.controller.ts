import { Controller, Post, Get, UseGuards, Param, Body } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationFounderAuth, PublicAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { MilestoneVestingService } from './milestone-vesting.service';
import { CreateMilestoneVestingInput } from './dto/milestone-vesting.input';

@Controller('milestone-vesting')
export class MilestoneVestingController {
  constructor(private readonly vesting: MilestoneVestingService) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createVesting(
    @Body()
    data: CreateMilestoneVestingInput
  ) {
    return this.vesting.create(data);
  }

  @ApiBearerAuth()
  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:vestingId')
  async getVesting(@Param('vestingId') vestingId: string) {
    return this.vesting.get(vestingId);
  }

  @ApiBearerAuth()
  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/organization/:organizationId')
  async getVestings(@Param('organizationId') organizationId: string) {
    return this.vesting.getVestingsByOrganization(organizationId);
  }
}
