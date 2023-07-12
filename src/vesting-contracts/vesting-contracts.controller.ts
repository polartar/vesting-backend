import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { VestingContractsService } from './vesting-contracts.service';
import { NormalAuth, OrganizationFounderAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import {
  CreateVestingContractInput,
  DeployVestingContractInput,
} from './dto/vesting-contracts.input';
import { ERROR_MESSAGES } from 'src/common/utils/messages';

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

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/:vestingContractId')
  async updateVestingContract(
    @Param('vestingContractId') vestingContractId: string,
    @Body() body: Partial<CreateVestingContractInput>
  ) {
    return this.vestingContract.update(vestingContractId, body);
  }

  /**
   * Update vestingContract deployment status
   * TODO remove once the blockchain listener is done
   */
  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/:vestingContractId/deploy')
  async deployVestingContract(
    @Param('vestingContractId') vestingContractId: string,
    @Body() body: DeployVestingContractInput
  ) {
    return this.vestingContract.deploy(vestingContractId, body);
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/organization/:organizationId')
  async getVestingContractsByOrganization(
    @Param('organizationId') organizationId: string
  ) {
    console.log(organizationId);
    const vestingContract = await this.vestingContract.getByOrganization(
      organizationId
    );
    if (!vestingContract) {
      throw new NotFoundException(ERROR_MESSAGES.CONTRACT_NOT_FOUND);
    }

    return vestingContract;
  }
}
