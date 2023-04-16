import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

import { CreateVestingInput } from './dto/vestings.input';
import { GetVestingQuery } from './dto/vesting.output';

@Injectable()
export class VestingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateVestingInput) {
    const vesting = await this.prisma.vesting.create({
      data: payload,
    });

    // TODO send email invitations

    return vesting;
  }

  async get(vestingId: string, query: GetVestingQuery) {
    return this.prisma.vesting.findUnique({
      where: { id: vestingId },
      include: {
        Organization: query.withOrganization
          ? {
              select: {
                id: true,
                name: true,
              },
            }
          : false,

        Token: query.withToken
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
}
