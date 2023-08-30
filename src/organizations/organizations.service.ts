import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Permission, Role, UserPermission } from '@prisma/client';
import {
  AddOrganizationVestingMembersInput,
  AddOrganizationPortfolioMembersInput,
  InviteVestingMemberInput,
} from './dto/organization.input';
import { generateRandomCode } from 'src/common/utils/helpers';
import { getExpiredTime } from 'src/common/utils/helper';
import { EmailService } from 'src/auth/email.service';
import { Platforms } from 'src/common/utils/constants';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService
  ) {}

  async create(email: string, name: string, userId: string) {
    const organization = await this.prisma.organization.create({
      data: {
        email,
        name,
        userId,
      },
    });

    await this.addRoleToVestingMember(organization.id, userId, Role.FOUNDER);
    await this.addPermissionToPortfolioMember(
      organization.id,
      userId,
      Permission.ADMIN
    );

    return organization;
  }

  async get(organizationId: string) {
    return this.prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        entities: true,
      },
    });
  }

  async update(
    organizationId: string,
    data: { email?: string; name?: string }
  ) {
    return this.prisma.organization.update({
      where: {
        id: organizationId,
      },
      data,
    });
  }

  async addRoleToVestingMember(
    organizationId: string,
    userId: string,
    role: Role
  ) {
    return this.prisma.userRole.create({
      data: {
        organizationId,
        role,
        userId,
      },
    });
  }

  async addPermissionToPortfolioMember(
    organizationId: string,
    userId: string,
    permission: Permission
  ) {
    return this.prisma.userPermission.create({
      data: {
        organizationId,
        userId,
        permission,
      },
    });
  }

  async addVestingMembers(payload: AddOrganizationVestingMembersInput) {
    const { organizationId, members } = payload;
    const data = members.filter(
      (member) => member.organizationId === organizationId
    );
    if (data.length !== members.length) {
      throw new BadRequestException('Wrong organizationId is provided');
    }

    return this.prisma.userRole.createMany({
      data,
    });
  }

  async addPortfolioMembers(payload: AddOrganizationPortfolioMembersInput) {
    const { organizationId, members } = payload;
    const data = members.filter(
      (member) => member.organizationId === organizationId
    );
    if (data.length !== members.length) {
      throw new BadRequestException('Wrong organizationId is provided');
    }

    return this.prisma.userPermission.createMany({
      data,
    });
  }

  async inviteVestingMember(
    organizationId: string,
    { email, name, role, redirectUri }: InviteVestingMemberInput
  ) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new BadRequestException('Organization not found', organizationId);
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }

    // create or update + validate role
    let userRole = await this.prisma.userRole.findFirst({
      where: {
        organizationId,
        userId: user.id,
      },
    });
    if (!userRole) {
      userRole = await this.prisma.userRole.create({
        data: {
          organizationId,
          userId: user.id,
          role,
        },
      });
    } else {
      if (userRole.role !== role) {
        throw new BadRequestException(
          `This user already has ${userRole.role} role`
        );
      }
    }

    // Generate email invitation code
    const code = generateRandomCode();
    await this.prisma.emailVerification.upsert({
      where: { email },
      create: { email, code, expiredAt: getExpiredTime() },
      update: { code, expiredAt: getExpiredTime() },
    });

    // Send email invitation
    const isSucceeded = await this.email.sendInvitationEmail(
      email,
      code,
      redirectUri,
      Platforms.App,
      name
    );
    if (!isSucceeded) {
      throw new BadRequestException(
        'Sending invitation email is failed',
        email
      );
    }
  }

  async invitePortfolioMember(
    organizationId: string,
    { email, name, permission, redirectUri, permissions }
  ) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new BadRequestException('Organization not found', organizationId);
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }

    // create or update + validate role
    let userPermission = await this.prisma.userPermission.findFirst({
      where: {
        organizationId,
        userId: user.id,
      },
    });
    if (!userPermission) {
      userPermission = await this.prisma.userPermission.create({
        data: {
          organizationId,
          userId: user.id,
          permission,
          permissions,
        },
      });
    } else {
      if (userPermission.permission !== permission) {
        throw new BadRequestException(
          `This user already has ${userPermission.permission} permission`
        );
      }
    }

    // Generate email invitation code
    const code = generateRandomCode();
    await this.prisma.emailVerification.upsert({
      where: { email },
      create: { email, code, expiredAt: getExpiredTime() },
      update: { code, expiredAt: getExpiredTime() },
    });

    // Send email invitation
    const isSucceeded = await this.email.sendInvitationEmail(
      email,
      code,
      redirectUri,
      Platforms.Portfolio,
      name
    );
    if (!isSucceeded) {
      throw new BadRequestException(
        'Sending invitation email is failed',
        email
      );
    }
  }

  async deleteVestingMember(organizationId: string, userId: string) {
    await this.prisma.userRole.deleteMany({
      where: {
        userId,
        organizationId,
      },
    });
  }

  async deletePortfolioMember(organizationId: string, userId: string) {
    await this.prisma.userPermission.deleteMany({
      where: {
        userId,
        organizationId,
      },
    });
  }

  async getVestingMembers(organizationId: string) {
    return this.prisma.userRole.findMany({
      where: {
        organizationId,
      },
      include: {
        user: true,
      },
    });
  }

  async getPortfolioMembers(organizationId: string) {
    return this.prisma.userPermission.findMany({
      where: {
        organizationId,
      },
      include: {
        user: true,
      },
    });
  }

  async getUserVestingOrganizations(userId: string) {
    return this.prisma.userRole.findMany({
      where: {
        userId,
      },
      include: {
        organization: true,
      },
    });
  }

  async getUserPortfolioOrganizations(userId: string, isAdmin?: boolean) {
    const where: {
      userId?: string;
    } = {};

    if (!isAdmin) {
      where.userId = userId;
    }

    return this.prisma.userPermission.findMany({
      where: {
        ...where,
        organization: {
          isNot: undefined,
        },
      },
      include: {
        organization: {
          include: {
            entities: true,
          },
        },
      },
    });
  }

  async getOrganizationRecipients(organizationId: string) {
    return this.prisma.recipe.findMany({
      where: {
        organizationId,
      },
      select: {
        user: true,
      },
    });
  }
}
