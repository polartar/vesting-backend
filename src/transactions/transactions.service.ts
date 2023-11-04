import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/transaction.input';
import { ITransactionsQuery } from './dto/interfaces';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<CreateTransactionInput, 'vestingContractId'>) {
    return this.prisma.transaction.create({
      data,
    });
  }

  async list(where: ITransactionsQuery) {
    return this.prisma.transaction.findMany({ where });
  }

  async update(transactionId: string, status: TransactionStatus) {
    console.log({ transactionId });
    console.log({ status });
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    });
  }
}
