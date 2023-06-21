import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';
import {
  AddOrganizationMembersInput,
  InviteMemberInput,
} from './dto/organization.input';
import { generateRandomCode } from 'src/common/utils/helpers';
import { getExpiredTime } from 'src/common/utils/helper';
import { EmailService } from 'src/auth/email.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService
  ) {}

  async create(email: string, name: string, userId: string, role: Role) {
    const organization = await this.prisma.organization.create({
      data: {
        email,
        name,
        userId,
      },
    });

    await this.addOrganizationMember(organization.id, userId, role);

    return organization;
  }

  async get(organizationId: string) {
    return this.prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
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

  async addOrganizationMember(
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

  async addOrganizationMembers(payload: AddOrganizationMembersInput) {
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

  async inviteOrganizationMember(
    organizationId: string,
    { email, role, redirectUri }: InviteMemberInput
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
      redirectUri
    );
    if (!isSucceeded) {
      throw new BadRequestException(
        'Sending invitation email is failed',
        email
      );
    }
  }

  async getOrganizationMembers(organizationId: string) {
    return this.prisma.userRole.findMany({
      where: {
        organizationId,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getUserOrganizations(userId: string) {
    return this.prisma.userRole.findMany({
      where: {
        userId,
      },
      include: {
        Organization: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
