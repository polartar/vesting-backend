import { PrismaService } from 'nestjs-prisma';
import {
  Inject,
  Injectable,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateSafeConfirmationInput,
  CreateSafeOwnerInput,
  CreateSafeWalletDetailInput,
  QuerySafeInput,
} from './dto/safe.input';
import { ISafeQuery } from './dto/interface';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class SafesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request
  ) {}

  /** Safe wallets */
  async createSafeWallet(data: CreateSafeWalletDetailInput) {
    const address = data.address.toLowerCase();
    return this.prisma.safeWallet.create({
      data: {
        ...data,
        address,
      },
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
    const organizationId =
      (this.request as any).organizationId || query.organizationId;

    if (!organizationId) {
      throw new BadRequestException("Organization Id can't be empty");
    }
    const where: ISafeQuery = {
      organizationId: organizationId,
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
    const organizationId =
      (this.request as any).organizationId || query.organizationId;

    if (!organizationId) {
      throw new BadRequestException("OrganizationId can't be empty");
    }

    const where: ISafeQuery = {
      organizationId: organizationId,
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
      address: address.toLowerCase(),
      name,
    }));
    return this.prisma.safeOwner.createMany({ data, skipDuplicates: true });
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
