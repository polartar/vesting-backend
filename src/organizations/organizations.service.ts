import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AddOrganizationMembersInput } from './dto/organization.input';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

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
