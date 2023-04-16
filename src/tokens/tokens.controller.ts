import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { NormalAuth, OrganizationFounderAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { TokensService } from './tokens.service';
import { CreateTokenInput } from './dto/token.input';

@Controller('token')
export class TokensController {
  constructor(private readonly token: TokensService) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createToken(@Body() body: CreateTokenInput) {
    return this.token.create(body);
  }

  // TODO add import token feature
  // @ApiBearerAuth()
  // @OrganizationFounderAuth()
  // @UseGuards(GlobalAuthGuard)
  // @Post('/import')
  // async importToken(@Body() body: CreateTokenInput) {
  //   return this.token.create(body);
  // }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:tokenId')
  async getToken(@Param('tokenId') tokenId: string) {
    return this.token.get(tokenId);
  }
}
