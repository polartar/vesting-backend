import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/transaction.input';
import { ITransactionsQuery } from './dto/interfaces';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<CreateTransactionInput, 'vestingContractId'>) {
    const body = { ...data };
    delete data.vestingIds;
    const transaction = await this.prisma.transaction.create({
      data,
    });

    if (body.vestingIds) {
      await this.prisma.vesting.updateMany({
        where: {
          id: {
            in: body.vestingIds,
          },
        },
        data: {
          transactionId: transaction.id,
        },
      });
    }

    return transaction;
  }

  async list(where: ITransactionsQuery) {
    return this.prisma.transaction.findMany({ where });
  }

  async update(transactionId: string, status: TransactionStatus) {
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    });
  }
}
