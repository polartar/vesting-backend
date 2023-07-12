import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  BadRequestException,
  Param,
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
}
