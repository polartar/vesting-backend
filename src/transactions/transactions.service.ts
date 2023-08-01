import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/transaction.input';
import { ITransactionsQuery } from './dto/interfaces';

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
}
