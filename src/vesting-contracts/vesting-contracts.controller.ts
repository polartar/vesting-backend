import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  NotFoundException,
  BadRequestException,
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
    try {
      const vestingContract = await this.vestingContract.create(body);
      return vestingContract;
    } catch (error) {
      console.error('POST /vesting-contract', error);
      throw new BadRequestException(ERROR_MESSAGES.CONTRACT_CREATION_FAILURE);
    }
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:vestingContractId')
  async getVestingContract(
    @Param('vestingContractId') vestingContractId: string
  ) {
    try {
      const vestingContract = await this.vestingContract.get(vestingContractId);
      if (!vestingContract) {
        throw new NotFoundException(ERROR_MESSAGES.CONTRACT_NOT_FOUND);
      }
      return vestingContract;
    } catch (error) {
      console.error('GET /vesting-contract/:vestingContractId', error);
      throw new BadRequestException(ERROR_MESSAGES.CONTRACT_NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/:vestingContractId')
  async updateVestingContract(
    @Param('vestingContractId') vestingContractId: string,
    @Body() body: Partial<CreateVestingContractInput>
  ) {
    try {
      const vestingContract = await this.vestingContract.update(
        vestingContractId,
        body
      );
      if (!vestingContract) {
        throw new NotFoundException(ERROR_MESSAGES.CONTRACT_NOT_FOUND);
      }
      return vestingContract;
    } catch (error) {
      console.error('Put /vesting-contract/:vestingContractId', error);
      throw new BadRequestException(ERROR_MESSAGES.CONTRACT_UPDATE_FAILURE);
    }
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
    try {
      const vestingContract = await this.vestingContract.deploy(
        vestingContractId,
        body
      );
      if (!vestingContract) {
        throw new NotFoundException(ERROR_MESSAGES.CONTRACT_NOT_FOUND);
      }
      return vestingContract;
    } catch (error) {
      console.error('Put /vesting-contract/:vestingContractId/deploy', error);
      throw new NotFoundException(ERROR_MESSAGES.CONTRACT_NOT_FOUND);
    }
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/organization/:organizationId')
  async getVestingContractsByOrganization(
    @Param('organizationId') organizationId: string
  ) {
    try {
      const vestingContract = await this.vestingContract.getByOrganization(
        organizationId
      );
      if (!vestingContract) {
        throw new NotFoundException(ERROR_MESSAGES.CONTRACT_NOT_FOUND);
      }
      return vestingContract;
    } catch (error) {
      console.error(
        'GET /vesting-contract/organization/:organizationId',
        error
      );
      throw new NotFoundException(ERROR_MESSAGES.CONTRACT_NOT_FOUND);
    }
  }
}
