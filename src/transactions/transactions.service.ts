import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/transaction.input';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ chainId, status, hash }: CreateTransactionInput) {
    return this.prisma.transaction.create({
      data: {
        chainId,
        status,
        hash,
      },
    });
  }
}
