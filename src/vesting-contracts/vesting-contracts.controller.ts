import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { VestingContractsService } from './vesting-contracts.service';
import { NormalAuth, OrganizationFounderAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { CreateVestingContractInput } from './dto/vesting-contracts.input';

@Controller('vesting-contract')
export class VestingContractsController {
  constructor(private readonly vestingContract: VestingContractsService) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createVestingContract(@Body() body: CreateVestingContractInput) {
    return this.vestingContract.create(body);
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:vestingContractId')
  async getVestingContract(
    @Param('vestingContractId') vestingContractId: string
  ) {
    return this.vestingContract.get(vestingContractId);
  }
}
