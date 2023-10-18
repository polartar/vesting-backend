import { Controller, UseGuards, Post, Get, Body, Param } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiKeyAuth,
  NormalAuth,
  OrganizationFounderAuth,
} from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { CreateMilestoneVestingTemplateInput } from './dto/milestone-vesting-templates.input';
import { MilestoneVestingTemplateService } from './milestone-vesting-template.service';

@Controller('milestone-vesting-template')
export class MilestoneVestingTemplateController {
  constructor(
    private readonly vestingTemplateService: MilestoneVestingTemplateService
  ) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createVestingTemplate(
    @Body() body: CreateMilestoneVestingTemplateInput
  ) {
    return this.vestingTemplateService.create(body);
  }

  @ApiBearerAuth()
  @ApiKeyAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:vestingTemplateId')
  async getVestingTemplate(
    @Param('vestingTemplateId') vestingTemplateId: string
  ) {
    return this.vestingTemplateService.get(vestingTemplateId);
  }
}
