import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

import { CreateVestingDetailInput } from './dto/vestings.input';
import { GetVestingQuery } from './dto/vesting.output';

@Injectable()
export class VestingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVestingDetailInput) {
    return this.prisma.vesting.create({ data });
  }

  async get(vestingId: string, query: GetVestingQuery) {
    return this.prisma.vesting.findUnique({
      where: { id: vestingId },
      include: {
        organization: query.withOrganization
          ? {
              select: {
                id: true,
                name: true,
              },
            }
          : false,

        token: query.withToken
          ? {
              select: {
                id: true,
                name: true,
                logo: true,
                chainId: true,
                address: true,
              },
            }
          : false,
      },
    });
  }

  async getVestingsByOrganization(organizationId: string) {
    return this.prisma.vesting.findMany({
      where: {
        organizationId,
      },
      include: {
        vestingContract: true,
        token: true,
      },
    });
  }
}
