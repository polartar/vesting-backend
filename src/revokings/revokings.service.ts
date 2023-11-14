import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { Revoking, TransactionStatus } from '@prisma/client';

@Injectable()
export class RevokingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ organizationId, vestingId, recipeId, chainId, status }) {
    return this.prisma.revoking.create({
      data: {
        organizationId,
        vestingId,
        recipeId,
        chainId,
        status: status || TransactionStatus.PENDING,
      },
    });
  }

  async get(where: Partial<Revoking>) {
    return this.prisma.revoking.findFirst({
      where,
    });
  }

  async getAll(where: Partial<Revoking>) {
    return this.prisma.revoking.findMany({
      where,
      include: {
        recipe: true,
      },
    });
  }

  async update(revokingId: string, data: Partial<Revoking>) {
    return this.prisma.revoking.update({
      where: { id: revokingId },
      data,
    });
  }
}
