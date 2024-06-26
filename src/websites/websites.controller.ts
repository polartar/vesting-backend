import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

import { WebsiteService } from './websites.service';
import { AdminAuth, ApiKeyAuth, PublicAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { CreateWebsiteInput } from './dto/websites.input';

@Controller('vesting-template')
export class WebsiteController {
  constructor(private readonly website: WebsiteService) {}

  @AdminAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createWebsite(@Body() body: CreateWebsiteInput) {
    return this.website.create(body);
  }

  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:organizationId')
  async getWebsiteByOrganization(
    @Param('organizationId') organizationId: string
  ) {
    return this.website.getByOrganization(organizationId);
  }

  @ApiKeyAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('')
  async getWebsite(@Request() req: { organizationId: string }) {
    return this.website.getByOrganization(req.organizationId);
  }
}
