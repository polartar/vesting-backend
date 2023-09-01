import { PrismaService } from 'nestjs-prisma';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import { RecipeStatus, VestingStatus } from '@prisma/client';

@Injectable()
export class IndexerService {
  constructor(private readonly prisma: PrismaService) {}

  async getTransaction(hash: string, chainId: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        hash: {
          contains: hash,
          mode: 'insensitive',
        },
        chainId,
      },
    });
    if (!transaction) {
      throw new BadRequestException(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
    }

    return transaction;
  }

  async updateTransactionStatus(id: string) {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        status: 'SUCCESS',
      },
    });
  }

  async updateVestingStatus(hash: string, chainId: number) {
    const transaction = await this.getTransaction(hash, chainId);

    const vesting = await this.prisma.vesting.findFirst({
      where: {
        transactionId: transaction.id,
      },
    });
    if (!vesting) {
      throw new BadRequestException(ERROR_MESSAGES.VESTING_NOT_FOUND);
    }

    const [newTransaction, newVesting] = await Promise.all([
      this.updateTransactionStatus(transaction.id),
      this.prisma.vesting.update({
        where: {
          id: vesting.id,
        },
        data: {
          status: VestingStatus.SUCCESS,
        },
      }),
    ]);

    return {
      transaction: newTransaction,
      vesting: newVesting,
    };
  }

  async revokeRecipient(hash: string, chainId: number, recipient: string) {
    const transaction = await this.getTransaction(hash, chainId);
    const recipe = await this.prisma.recipe.findFirst({
      where: {
        address: {
          contains: recipient,
          mode: 'insensitive',
        },
      },
    });
    if (!recipe) {
      throw new BadRequestException(ERROR_MESSAGES.RECIPIENT_NOT_FOUND);
    }

    const revoking = await this.prisma.revoking.findFirst({
      where: {
        transactionId: transaction.id,
      },
    });
    if (!revoking) {
      throw new BadRequestException(ERROR_MESSAGES.REVOKING_NOT_FOUND);
    }

    const [newTransaction, newRecipe, newRevoking] = await Promise.all([
      this.updateTransactionStatus(transaction.id),
      this.prisma.recipe.update({
        where: {
          id: recipe.id,
        },
        data: {
          status: RecipeStatus.REVOKED,
        },
      }),
      this.prisma.revoking.update({
        where: {
          id: revoking.id,
        },
        data: {
          status: 'SUCCESS',
        },
      }),
    ]);

    return {
      transaction: newTransaction,
      recipe: newRecipe,
      revoking: newRevoking,
    };
  }

  async updateVestingContractBalance(address: string, balance: string) {
    const contract = await this.prisma.vestingContract.findFirst({
      where: {
        address: {
          contains: address,
          mode: 'insensitive',
        },
      },
    });
    if (!contract) {
      throw new BadRequestException(ERROR_MESSAGES.CONTRACT_NOT_FOUND);
    }

    return this.prisma.vestingContract.update({
      where: { id: contract.id },
      data: { balance },
    });
  }
}
