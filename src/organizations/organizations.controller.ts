import {
  Controller,
  Post,
  Body,
  Request,
  Param,
  Get,
  Put,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { OrganizationsService } from './organizations.service';
import {
  AddOrganizationPortfolioMembersInput,
  AddOrganizationVestingMembersInput,
  CreateOrganizationInput,
  InviteVestingMemberInput,
  InvitePortfolioMemberInput,
  UpdateOrganizationInput,
  DeleteOrganizationMemberInput,
} from './dto/organization.input';
import { User } from 'src/users/models/user.model';
import {
  NormalAuth,
  OrganizationFounderAuth,
  PortfolioAdminAuth,
} from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/messages';

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
        req.user.id
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
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/app')
  async getVestingOrganizations(@Request() req: { user: User }) {
    try {
      const organizations = await this.organization.getUserVestingOrganizations(
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
  @Get('/portfolio')
  async getPortfolioOrganizations(@Request() req: { user: User }) {
    try {
      const organizations =
        await this.organization.getUserPortfolioOrganizations(req.user.id);
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
  @Get('/:organizationId/get')
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
  @Post('/:organizationId/members/app')
  async addVestingMembers(@Body() body: AddOrganizationVestingMembersInput) {
    try {
      await this.organization.addVestingMembers(body);
      return SUCCESS_MESSAGES.ORGANIZATION_ADD_MEMBERS;
    } catch (error) {
      console.error(
        'Error: POST /organization/:organizationId/members/app',
        error
      );
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_ADD_MEMBERS_FAILURE
      );
    }
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/:organizationId/members/portfolio')
  async addPortfolioMembers(
    @Body() body: AddOrganizationPortfolioMembersInput
  ) {
    try {
      await this.organization.addPortfolioMembers(body);
      return SUCCESS_MESSAGES.ORGANIZATION_ADD_MEMBERS;
    } catch (error) {
      console.error(
        'Error: POST /organization/:organizationId/members/portfolio',
        error
      );
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_ADD_MEMBERS_FAILURE
      );
    }
  }

  /** Invite members */

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/:organizationId/invite/app')
  async inviteVestingMember(
    @Param('organizationId') organizationId: string,
    @Body() body: InviteVestingMemberInput
  ) {
    try {
      await this.organization.inviteVestingMember(organizationId, body);
      return SUCCESS_MESSAGES.ORGANIZATION_INVITE_MEMBERS;
    } catch (error) {
      console.error(
        'Error: POST /organization/:organizationId/invite/app',
        error
      );
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_INVITE_MEMBERS_FAILURE
      );
    }
  }

  @ApiBearerAuth()
  @PortfolioAdminAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/:organizationId/invite/portfolio')
  async invitePortfolioMember(
    @Param('organizationId') organizationId: string,
    @Body() body: InvitePortfolioMemberInput
  ) {
    try {
      await this.organization.invitePortfolioMember(organizationId, body);
      return SUCCESS_MESSAGES.ORGANIZATION_INVITE_MEMBERS;
    } catch (error) {
      console.error(
        'Error: POST /organization/:organizationId/invite/portfolio',
        error
      );
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_INVITE_MEMBERS_FAILURE
      );
    }
  }

  /** Remove organization members */

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Delete('/:organizationId/invite/app')
  async deleteVestingMember(
    @Param('organizationId') organizationId: string,
    @Body() { userId }: DeleteOrganizationMemberInput
  ) {
    try {
      await this.organization.deleteVestingMember(organizationId, userId);
      return SUCCESS_MESSAGES.ORGANIZATION_INVITE_MEMBERS;
    } catch (error) {
      console.error(
        'Error: POST /organization/:organizationId/invite/app',
        error
      );
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_INVITE_MEMBERS_FAILURE
      );
    }
  }

  @ApiBearerAuth()
  @PortfolioAdminAuth()
  @UseGuards(GlobalAuthGuard)
  @Delete('/:organizationId/invite/portfolio')
  async deletePortfolioMember(
    @Param('organizationId') organizationId: string,
    @Body() { userId }: DeleteOrganizationMemberInput
  ) {
    try {
      await this.organization.deletePortfolioMember(organizationId, userId);
      return SUCCESS_MESSAGES.ORGANIZATION_INVITE_MEMBERS;
    } catch (error) {
      console.error(
        'Error: POST /organization/:organizationId/invite/portfolio',
        error
      );
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_INVITE_MEMBERS_FAILURE
      );
    }
  }

  /** Get Organization Members */

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:organizationId/members/app')
  async getVestingMembers(@Param('organizationId') organizationId: string) {
    try {
      const members = await this.organization.getVestingMembers(organizationId);
      return members;
    } catch (error) {
      console.error(
        'Error: GET /organization/:organizationId/members/app',
        error
      );
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_GET_ALL_MEMBERS_FAILURE
      );
    }
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:organizationId/members/portfolio')
  async getPortfolioMembers(@Param('organizationId') organizationId: string) {
    try {
      const members = await this.organization.getPortfolioMembers(
        organizationId
      );
      return members;
    } catch (error) {
      console.error(
        'Error: GET /organization/:organizationId/members/portfolio',
        error
      );
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_GET_ALL_MEMBERS_FAILURE
      );
    }
  }

  /** Fetch All recipients */
  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:organizationId/recipients')
  async getOrganizationRecipients(
    @Param('organizationId') organizationId: string
  ) {
    try {
      const recipients = await this.organization.getOrganizationRecipients(
        organizationId
      );
      return recipients;
    } catch (error) {
      console.error(
        'Error: GET /organization/:organizationId/members/portfolio',
        error
      );
      throw new BadRequestException(
        ERROR_MESSAGES.ORGANIZATION_GET_ALL_RECIPIENTS_FAILURE
      );
    }
  }
}
