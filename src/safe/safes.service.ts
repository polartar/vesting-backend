import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import {
  CreateSafeConfirmationInput,
  CreateSafeWalletInput,
} from './dto/safe.input';

@Injectable()
export class SafesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Safe wallets */
  async createSafeWallet(data: CreateSafeWalletInput) {
    return this.prisma.safeWallet.create({
      data,
    });
  }

  async getSafeWallet(safeWalletId: string) {
    return this.prisma.safeWallet.findUnique({
      where: {
        id: safeWalletId,
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
}
