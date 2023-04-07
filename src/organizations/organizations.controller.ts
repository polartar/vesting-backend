import {
  Controller,
  Post,
  Body,
  Request,
  Param,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { OrganizationsService } from './organizations.service';
import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from './dto/organization.input';
import { User } from 'src/users/models/user.model';
import { NormalAuth, OrganizationFounderAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';

@Controller('organization')
export class OrganizationsController {
  constructor(private readonly organization: OrganizationsService) {}

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createOrganization(
    @Body() body: CreateOrganizationInput,
    @Request() req: { user: User }
  ) {
    return this.organization.create(body.email, body.name, req.user.id);
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/:organizationId')
  async updateOrganization(
    @Body() body: UpdateOrganizationInput,
    @Param('organizationId') organizationId: string
  ) {
    return this.organization.update(organizationId, body);
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/')
  async getOrganizations(@Request() req: { user: User }) {
    return this.organization.getUserOrganizations(req.user.id);
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:organizationId')
  async getOrganization(@Param('organizationId') organizationId: string) {
    return this.organization.get(organizationId);
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:organizationId/members')
  async getOrganizationMembers(
    @Param('organizationId') organizationId: string
  ) {
    return this.organization.getOrganizationMembers(organizationId);
  }
}
