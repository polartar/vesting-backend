import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import {
  CreateSafeConfirmationInput,
  CreateSafeWalletDetailInput,
} from './dto/safe.input';

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
      select: {
        id: true,
        chainId: true,
        address: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
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
  async createSafeOwners(safeWalletId: string, addresses: string[]) {
    const data = addresses.map((address) => ({ safeWalletId, address }));
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
      select: {
        id: true,
        chainId: true,
        address: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        safeOwners: true,
      },
    });
  }
}
