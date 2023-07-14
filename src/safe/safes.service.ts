import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import {
  CreateSafeConfirmationInput,
  CreateSafeOwnerInput,
  CreateSafeWalletDetailInput,
  QuerySafeInput,
} from './dto/safe.input';
import { ISafeQuery } from './dto/interface';

@Injectable()
export class SafesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Safe wallets */
  async createSafeWallet(data: CreateSafeWalletDetailInput) {
    return this.prisma.safeWallet.create({
      data,
    });
  }

  async getSafeWallet(safeWalletId: string) {
    return this.prisma.safeWallet.findUnique({
      where: {
        id: safeWalletId,
      },
      include: {
        safeOwners: true,
      },
    });
  }

  async getSafeByAddress(address: string) {
    return this.prisma.safeWallet.findFirst({
      where: {
        address: {
          mode: 'insensitive',
          contains: address,
        },
      },
      include: {
        safeOwners: true,
      },
    });
  }

  async getSafeByQuery(query: QuerySafeInput) {
    const where: ISafeQuery = {
      organizationId: query.organizationId,
    };

    if (query.address) {
      where.address = {
        mode: 'insensitive',
        contains: query.address,
      };
    }

    if (query.chainId) {
      where.chainId = +query.chainId;
    }

    return this.prisma.safeWallet.findFirst({
      where,
      include: {
        safeOwners: true,
      },
    });
  }

  async getSafesByQuery(query: QuerySafeInput) {
    const where: ISafeQuery = {
      organizationId: query.organizationId,
    };

    if (query.address) {
      where.address = {
        mode: 'insensitive',
        contains: query.address,
      };
    }

    if (query.chainId) {
      where.chainId = +query.chainId;
    }

    return this.prisma.safeWallet.findMany({
      where,
      include: {
        safeOwners: true,
      },
    });
  }

  async validateOrganizationSafeWallet(
    organizationId: string,
    safeWalletId: string
  ) {
    return this.prisma.safeWallet.findFirst({
      where: {
        organizationId,
        id: safeWalletId,
      },
    });
  }

  /** Safe Owners */
  async createSafeOwners(safeWalletId: string, owners: CreateSafeOwnerInput[]) {
    const data = owners.map(({ address, name }) => ({
      safeWalletId,
      address,
      name,
    }));
    return this.prisma.safeOwner.createMany({ data });
  }

  /** Safe Confirmations */
  async createSafeConfirmation(data: CreateSafeConfirmationInput) {
    return this.prisma.safeConfirmation.create({
      data,
    });
  }

  async getSafesByOrganization(organizationId: string) {
    return this.prisma.safeWallet.findMany({
      where: { organizationId },
      include: {
        safeOwners: true,
      },
    });
  }
}
