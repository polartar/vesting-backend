import {
  Body,
  Controller,
  UseGuards,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { IndexerAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import {
  UpdateTransactionInput,
  UpdateVestingContractBalanceInput,
} from './dto/indexer.input';
import { IndexerService } from './indexer.service';
import { TransactionEvents } from './dto/interfaces';

@Controller('indexer')
export class IndexerController {
  constructor(private readonly indexer: IndexerService) {}

  @IndexerAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/transaction/status')
  async updateTransaction(@Body() body: UpdateTransactionInput) {
    if (body.event === TransactionEvents.ClaimCreated) {
      const response = await this.indexer.updateVestingStatus(
        body.hash,
        body.chainId
      );
      return response;
    }

    if (!body.address) {
      throw new BadRequestException(
        'address is the required field for revoking'
      );
    }

    const response = await this.indexer.revokeRecipient(
      body.hash,
      body.chainId,
      body.address
    );
    return response;
  }

  @IndexerAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/vesting-contract/balance')
  async updateVestingContractBalance(
    @Body() body: UpdateVestingContractBalanceInput
  ) {
    const contract = await this.indexer.updateVestingContractBalance(
      body.address,
      body.amount
    );
    return contract;
  }
}
