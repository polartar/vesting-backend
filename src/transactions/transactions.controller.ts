import { Controller, UseGuards, Body, Post, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationFounderAuth, PublicAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import {
  CreateTransactionInput,
  QueryTransactionsInput,
} from './dto/transaction.input';
import { ITransactionsQuery } from './dto/interfaces';
import { VestingContractsService } from 'src/vesting-contracts/vesting-contracts.service';

@Controller('transaction')
export class TransactionsController {
  constructor(
    private readonly transaction: TransactionsService,
    private readonly vestingContract: VestingContractsService
  ) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createTransaction(
    @Body() { vestingContractId, ...body }: CreateTransactionInput
  ) {
    const transaction = await this.transaction.create(body);

    if (vestingContractId) {
      // vesting contract deployment tx
      await this.vestingContract.setDeployTransaction(
        transaction.id,
        vestingContractId
      );
    }

    return transaction;
  }

  @ApiBearerAuth()
  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/list')
  async getTransactions(@Query() query: QueryTransactionsInput) {
    const where: ITransactionsQuery = {};

    if (query.organizationId) {
      where.organizationId = query.organizationId;
    }

    if (query.chainId) {
      where.chainId = +query.chainId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.to) {
      where.to = query.to;
    }

    const transactions = await this.transaction.list(where);
    return transactions;
  }
}
