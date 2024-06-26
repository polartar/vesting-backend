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
  ResendPortfolioMemberInput,
} from './dto/organization.input';
import { User } from 'src/users/models/user.model';
import {
  ApiKeyAuth,
  NormalAuth,
  OrganizationFounderAuth,
  PortfolioAdminAuth,
} from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/messages';
import { EntitiesService } from 'src/entities/entities.service';
import { Permission } from '@prisma/client';

@Controller('organization')
export class OrganizationsController {
  constructor(
    private readonly organization: OrganizationsService,
    private readonly entities: EntitiesService
  ) {}

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
        await this.organization.getUserPortfolioOrganizations(
          req.user.id,
          req.user.isAdmin
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
    let permissions: Record<string, boolean> = {};

    if (body.permission === Permission.READ) {
      const entityCount = await this.entities.count({ organizationId });

      // if organization has any entity, entityId should be provided in request.
      if (entityCount > 0) {
        if (!body.entityIds?.length) {
          throw new BadRequestException(
            ERROR_MESSAGES.ORGANIZATION_INVITE_MEMBERS_WITH_EMPTY_ENTITIES
          );
        }

        // calculate the entities count with request entityIds
        const count = await this.entities.count({
          organizationId,
          id: {
            in: body.entityIds,
          },
        });
        if (count !== body.entityIds.length) {
          throw new BadRequestException(
            ERROR_MESSAGES.ORGANIZATION_INVITE_MEMBERS_WITH_BAD_ENTITIES
          );
        }

        permissions = body.entityIds.reduce(
          (value, entityId) => ({
            ...value,
            [entityId]: true,
          }),
          permissions
        );
      }
    }

    await this.organization.invitePortfolioMember(organizationId, {
      email: body.email,
      name: body.name,
      permission: body.permission,
      redirectUri: body.redirectUri,
      permissions,
    });
    return SUCCESS_MESSAGES.ORGANIZATION_INVITE_MEMBERS;
  }

  @ApiBearerAuth()
  @PortfolioAdminAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/:organizationId/resend/portfolio')
  async resentPortfolioInvitation(
    @Param('organizationId') organizationId: string,
    @Body() body: ResendPortfolioMemberInput
  ) {
    await this.organization.resendPortfolioInvitation(
      organizationId,
      body.email.toLowerCase(),
      body.redirectUri
    );
    return SUCCESS_MESSAGES.ORGANIZATION_RESEND_INVITATION;
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
  @ApiKeyAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/members/app')
  async getVestingMembersWithApiKey(
    @Request() req: { organizationId: string }
  ) {
    try {
      const members = await this.organization.getVestingMembers(
        req.organizationId
      );
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

  @ApiBearerAuth()
  @ApiKeyAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/members/portfolio')
  async getPortfolioMembersWithApiKey(
    @Request() req: { organizationId: string }
  ) {
    try {
      const members = await this.organization.getPortfolioMembers(
        req.organizationId
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

  /** Fetch All recipients */
  @ApiBearerAuth()
  @ApiKeyAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/recipients')
  async getRecipientsWithApiKey(@Request() req: { organizationId: string }) {
    try {
      const recipients = await this.organization.getOrganizationRecipients(
        req.organizationId
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
