import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Role } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UsersService
  ) {}

  async create(email: string, name: string, userId: string) {
    const organization = await this.prisma.organization.create({
      data: {
        email,
        name,
        userId,
      },
    });

    await this.addOrganizationMember(organization.id, userId, Role.FOUNDER);

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
