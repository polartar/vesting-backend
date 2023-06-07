import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { SafesService } from './safes.service';

import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { OrganizationFounderAuth, WalletAuth } from 'src/common/utils/auth';
import {
  CreateSafeConfirmationInput,
  CreateSafeOwnersInput,
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
  async createSafeWallet(@Body() body: CreateSafeWalletInput) {
    try {
      const safe = await this.safe.createSafeWallet(body);
      return safe;
    } catch (error) {
      console.error('Error: POST /safe/wallet', error);
      throw new BadRequestException(ERROR_MESSAGES.SAFE_CREATE_WALLET);
    }
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/owners')
  async createSafeOwners(
    @Body() { organizationId, safeWalletId, addresses }: CreateSafeOwnersInput
  ) {
    try {
      // Validate safeWalletId is organizationId's safe wallet
      const safeWallet = await this.safe.validateOrganizationSafeWallet(
        organizationId,
        safeWalletId
      );
      if (!safeWallet) {
        throw new NotFoundException(ERROR_MESSAGES.SAFE_NOT_FOUND_WALLET);
      }

      const safe = await this.safe.createSafeOwners(safeWalletId, addresses);
      return safe;
    } catch (error) {
      console.error('Error: POST /safe/owners', error);
      throw new BadRequestException(ERROR_MESSAGES.SAFE_CREATE_OWNER_WALLETS);
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
}
