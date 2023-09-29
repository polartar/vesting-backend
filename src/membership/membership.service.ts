import { PrismaService } from 'nestjs-prisma';
import {
  Inject,
  Injectable,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { generateApiKey } from 'src/common/utils/helpers';
import { REQUEST } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { ERROR_MESSAGES } from 'src/common/utils/messages';

@Injectable()
export class MembershipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  async create(organizationId: string) {
    const key = generateApiKey();

    const membership = await this.prisma.membership.create({
      data: {
        organizationId,
        key,
      },
    });
    return membership;
  }

  async getByKey(key: string) {
    const membership = await this.prisma.membership.findFirstOrThrow({
      where: {
        key,
      },
    });
    return membership;
  }

  async getMemberShips(organizationId: string) {
    const userId = (this.request as any).user.id;
    const user = await this.userService.getUserWithOrganization(userId);
    const userOrgIds = user.organizations.map(
      (organization) => organization.id
    );
    if (!userOrgIds.includes(organizationId)) {
      throw new BadRequestException(ERROR_MESSAGES.ORGANIZATION_INVALID);
    }

    return await this.prisma.membership.findMany({
      where: {
        organizationId,
      },
    });
  }

  async deleteMembership(membershipId: string) {
    return this.prisma.membership.delete({
      where: { id: membershipId },
    });
  }
}
