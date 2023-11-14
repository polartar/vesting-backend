import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Query,
  BadRequestException,
  Put,
  Param,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationFounderAuth, PublicAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import {
  CreateTransactionInput,
  QueryTransactionsInput,
  UpdateTransactionInput,
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
    if (body.type === 'VESTING_DEPLOYMENT' && !vestingContractId) {
      throw new BadRequestException(
        `'vestingContractId' is a required field for 'VESTING_DEPLOYMENT' transaction.`
      );
    }

    const transaction = await this.transaction.create(body);

    if (vestingContractId) {
      // vesting contract deployment tx
      await this.vestingContract.setDeployTransaction(
        vestingContractId, 
        transaction.id
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

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/:transactionId')
  async updateTransaction(
    @Body() body: UpdateTransactionInput,
    @Param('transactionId') transactionId: string
  ) {
    return await this.transaction.update(transactionId, body.status);
  }
}
