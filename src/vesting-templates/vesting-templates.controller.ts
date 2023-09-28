import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { VestingTemplatesService } from './vesting-templates.service';
import {
  ApiKeyAuth,
  NormalAuth,
  OrganizationFounderAuth,
} from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { CreateVestingTemplateInput } from './dto/vesting-templates.input';

@Controller('vesting-template')
export class VestingTemplatesController {
  constructor(private readonly vestingTemplate: VestingTemplatesService) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createVestingTemplate(@Body() body: CreateVestingTemplateInput) {
    return this.vestingTemplate.create(body);
  }

  @ApiBearerAuth()
  @ApiKeyAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:vestingTemplateId')
  async getVestingTemplate(
    @Param('vestingTemplateId') vestingTemplateId: string
  ) {
    return this.vestingTemplate.get(vestingTemplateId);
  }
}
