import {
  Controller,
  Post,
  Body,
  Request,
  Param,
  Get,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { OrganizationsService } from './organizations.service';
import {
  AddOrganizationMembersInput,
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from './dto/organization.input';
import { User } from 'src/users/models/user.model';
import {
  AdminAuth,
  NormalAuth,
  OrganizationFounderAuth,
} from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/messages';
import { Role } from '@prisma/client';

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
    try {
      const organization = await this.organization.create(
        body.email,
        body.name,
        req.user.id,
        Role.FOUNDER
      );
      return organization;
    } catch (error) {
      console.error('Error: POST /organization', error);
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_CREATION_FAILURE
      );
    }
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/:organizationId')
  async updateOrganization(
    @Body() body: UpdateOrganizationInput,
    @Param('organizationId') organizationId: string
  ) {
    try {
      const organization = await this.organization.update(organizationId, body);
      return organization;
    } catch (error) {
      console.error('Error: PUT /organization', error);
      throw new BadRequestException(ERROR_MESSAGES.ORGANIZATION_UPDATE_FAILURE);
    }
  }

  @ApiBearerAuth()
  @AdminAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/')
  async getOrganizations(@Request() req: { user: User }) {
    try {
      const organizations = await this.organization.getUserOrganizations(
        req.user.id
      );
      return organizations;
    } catch (error) {
      console.error('Error: GET /organization', error);
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_GET_ALL_FAILURE
      );
    }
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:organizationId')
  async getOrganization(@Param('organizationId') organizationId: string) {
    try {
      const organization = await this.organization.get(organizationId);
      return organization;
    } catch (error) {
      console.error('Error: GET /organization/:organizationId', error);
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_GET_ONE_FAILURE
      );
    }
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/:organizationId/members')
  async addOrganizationMembers(@Body() body: AddOrganizationMembersInput) {
    try {
      await this.organization.addOrganizationMembers(body);
      return SUCCESS_MESSAGES.ORGANIZATION_ADD_MEMBERS;
    } catch (error) {
      console.error('Error: POST /organization/:organizationId/members', error);
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_ADD_MEMBERS_FAILURE
      );
    }
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:organizationId/members')
  async getOrganizationMembers(
    @Param('organizationId') organizationId: string
  ) {
    try {
      const members = await this.organization.getOrganizationMembers(
        organizationId
      );
      return members;
    } catch (error) {
      console.error('Error: GET /organization/:organizationId/members', error);
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_GET_ALL_MEMBERS_FAILURE
      );
    }
  }
}
