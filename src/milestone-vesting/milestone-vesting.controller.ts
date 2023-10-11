import {
  Controller,
  Post,
  Get,
  Put,
  UseGuards,
  Param,
  Body,
  Request,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { VestingContract } from '@prisma/client';
import {
  ApiKeyAuth,
  NormalAuth,
  OrganizationFounderAuth,
  PublicAuth,
} from 'src/common/utils/auth';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { VestingContractsService } from 'src/vesting-contracts/vesting-contracts.service';
import { MilestoneVestingService } from './milestone-vesting.service';
import { RecipesService } from 'src/recipe/recipes.service';
import { TokensService } from 'src/tokens/tokens.service';
import { CreateMilestoneVestingInput } from './dto/milestone-vesting.input';

@Controller('milestone-vesting')
export class MilestoneVestingController {
  constructor(
    private readonly vesting: MilestoneVestingService,
    private readonly recipe: RecipesService,
    private readonly token: TokensService
  ) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createVesting(
    @Body()
    data: CreateMilestoneVestingInput
  ) {
    return this.vesting.create(data);
  }

  @ApiBearerAuth()
  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:vestingId')
  async getVesting(@Param('vestingId') vestingId: string) {
    return this.vesting.get(vestingId);
  }
}
