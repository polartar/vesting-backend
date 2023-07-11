import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { NormalAuth, OrganizationFounderAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';

import { TokensService } from './tokens.service';

import { CreateTokenInput, ImportTokenInput } from './dto/token.input';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import { AlchemyService } from 'src/alchemy/alchemy.service';
import { User } from '@prisma/client';

@Controller('token')
export class TokensController {
  constructor(
    private readonly token: TokensService,
    private readonly alchmey: AlchemyService
  ) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createToken(@Body() body: CreateTokenInput) {
    return this.token.create(body);
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/import')
  async importToken(@Body() body: ImportTokenInput) {
    try {
      const { metadata, validated } =
        await this.alchmey.validateERC20TokenAddress(
          body.address,
          body.chainId
        );
      if (!validated) {
        throw new BadRequestException(ERROR_MESSAGES.INVALID_ERC20_TOKEN);
      }

      const token = await this.token.import({
        chainId: body.chainId,
        logo: body.logo,
        name: metadata.name,
        symbol: metadata.symbol,
        decimal: metadata.decimals,
        organizationId: body.organizationId,
        isDeployed: true,
        address: body.address,
        burnable: body.burnable,
      });
      return token;
    } catch (error) {
      console.error('Importing Token Error', error);
      throw new BadRequestException(ERROR_MESSAGES.IMPORT_TOKEN_FAILURE);
    }
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:tokenId')
  async getToken(@Param('tokenId') tokenId: string) {
    return this.token.get(tokenId);
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/')
  async getTokens(@Request() req: { user: User }) {
    const tokens = await this.token.getMyTokens(req.user.id);
    return tokens.map(({ token }) => token);
  }
}
