import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

import {
  CreateVestingDetailInput,
  UpdateVestingInput,
} from './dto/vestings.input';
import { GetVestingQuery } from './dto/vesting.output';
import { IVestingsQuery } from './dto/interface';

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

  async getAll(where: IVestingsQuery) {
    return this.prisma.vesting.findMany({
      where,
      include: {
        vestingContract: true,
      },
    });
  }

  async update(vestingId: string, data: UpdateVestingInput) {
    return this.prisma.vesting.updateMany({
      where: {
        id: vestingId,
        organizationId: data.organizationId,
      },
      data,
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

  async delete(organizationId: string, vestingId: string) {
    await this.prisma.vesting.findFirstOrThrow({
      where: {
        id: vestingId,
        organizationId: organizationId,
      },
    });
    const recipes = await this.prisma.recipe.findMany({
      where: { vestingId: vestingId },
      include: {
        wallet: { include: { recipes: true } },
        user: { include: { recipes: true } },
      },
    });
    await Promise.all(
      recipes.map(async (recipe) => {
        if (recipe.wallet.recipes.length === 1) {
          await this.prisma.wallet.delete({ where: { id: recipe.wallet.id } });
        }
        if (recipe.user.recipes.length === 1) {
          await this.prisma.user.delete({ where: { id: recipe.user.id } });
        }
        return await this.prisma.recipe.delete({ where: { id: recipe.id } });
      })
    );
    await this.prisma.vesting.delete({
      where: { id: vestingId },
    });
  }
}
