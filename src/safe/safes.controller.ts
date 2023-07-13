import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { SafesService } from './safes.service';

import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import {
  NormalAuth,
  OrganizationFounderAuth,
  WalletAuth,
} from 'src/common/utils/auth';
import {
  CreateSafeConfirmationInput,
  CreateSafeWalletInput,
  QuerySafeInput,
} from './dto/safe.input';
import { ERROR_MESSAGES } from 'src/common/utils/messages';

@Controller('safe')
export class SafesController {
  constructor(private readonly safe: SafesService) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @WalletAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/wallet')
  async createSafeWallet(
    @Body() { owners, ...safeDetails }: CreateSafeWalletInput
  ) {
    try {
      const safe = await this.safe.createSafeWallet(safeDetails);
      await this.safe.createSafeOwners(safe.id, owners);
      return this.safe.getSafeWallet(safe.id);
    } catch (error) {
      console.error('Error: POST /safe/wallet', error);
      throw new BadRequestException(ERROR_MESSAGES.SAFE_CREATE_WALLET);
    }
  }

  @ApiBearerAuth()
  @WalletAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/confirmation')
  async createSafeConfirmation(@Body() body: CreateSafeConfirmationInput) {
    try {
      const safeConfirmation = await this.safe.createSafeConfirmation(body);
      return safeConfirmation;
    } catch (error) {
      console.error('Error: POST /safe/confirmation', error);
      throw new BadRequestException(ERROR_MESSAGES.SAFE_CREATE_CONFIRMATION);
    }
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/organization/:organizationId')
  async getSafesByOrganization(
    @Param('organizationId') organizationId: string
  ) {
    return this.safe.getSafesByOrganization(organizationId);
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/get/single')
  async getSafeByAddress(@Query() query: QuerySafeInput) {
    const safe = await this.safe.getSafeByQuery(query);
    if (!safe) {
      throw new NotFoundException(ERROR_MESSAGES.SAFE_NOT_FOUND_WALLET);
    }

    return safe;
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/get/list')
  async getSafesByAddress(@Query() query: QuerySafeInput) {
    return this.safe.getSafesByQuery(query);
  }
}
