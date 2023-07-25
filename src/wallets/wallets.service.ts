import { ethers } from 'ethers';
import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Wallet } from '@prisma/client';

import { SIGN_MESSAGE_TEMPLATE } from 'src/common/utils/constants';
import { compareStrings } from 'src/common/utils/helpers';
import { ERROR_MESSAGES } from 'src/common/utils/messages';

@Injectable()
export class WalletsService {
  constructor(private prisma: PrismaService) {}

  getWallet(walletId: string): Promise<Wallet> {
    return this.prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });
  }

  validateSignature(
    signature: string,
    address: string,
    utcTime: UTCString
  ): boolean {
    const message = SIGN_MESSAGE_TEMPLATE(address, utcTime);
    const recovered = ethers.verifyMessage(message, signature);
    return compareStrings(recovered, address);
  }

  async findOrCreate(userId: string, address: string) {
    const account = address.toLowerCase();
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        address: account,
      },
    });

    if (wallet) {
      if (wallet.userId !== userId) {
        throw new BadRequestException(ERROR_MESSAGES.WRONG_WALLET_OWNER);
      }

      return wallet;
    }

    return this.prisma.wallet.create({
      data: {
        address: account,
        userId,
      },
    });
  }
}
