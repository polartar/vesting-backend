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
    this.vesting.create(data);
    // const vestingRecipients = recipes.map((recipient) => ({
    //   ...recipient,
    //   name: recipient.name || '',
    //   email: recipient.email?.toLowerCase() || '',
    //   address: recipient.address?.toLowerCase() || '',
    // }));

    // const vesting = await this.vesting.create(vestingDetails);

    // const data = await Promise.all(
    //   vestingRecipients.map((recipe) =>
    //     this.recipe.create({
    //       allocations: recipe.allocations,
    //       organizationId: vestingDetails.organizationId,
    //       name: recipe.name,
    //       email: recipe.email,
    //       role: recipe.role,
    //       vestingId: vesting.id,
    //       redirectUri,
    //       address: recipe.address?.toLowerCase() ?? '',
    //       tokenSymbol: token.symbol,
    //     })
    //   )
    // );

    // return data;
  }

  @ApiBearerAuth()
  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:vestingId')
  async getVesting(@Param('vestingId') vestingId: string) {
    return this.vesting.get(vestingId, {
      withOrganization: true,
      withToken: true,
    });
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/:vestingId')
  async updateVesting(
    @Param('vestingId') vestingId: string,
    @Body() body: UpdateVestingInput
  ) {
    const vesting = await this.vesting.update(vestingId, body);
    if (!vesting) {
      throw new NotFoundException(ERROR_MESSAGES.VESTING_NOT_FOUND);
    }

    return vesting;
  }

  /** Fetch all vestings by organization */
  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/organization/:organizationId')
  async getVestingsByOrganization(
    @Param('organizationId') organizationId: string
  ) {
    return this.vesting.getVestingsByOrganization(organizationId);
  }

  @ApiBearerAuth()
  @NormalAuth()
  @ApiKeyAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/list')
  async getVestings(
    @Query() query: VestingsQueryInput,
    @Request() req: { organizationId: string }
  ) {
    const organizationId = query.organizationId || req.organizationId;
    if (!organizationId) {
      throw new BadRequestException("OrganizationId can't be empty");
    }
    const where: IVestingsQuery = {
      organizationId: organizationId,
    };

    if (query.vestingContractId) {
      where.vestingContractId = query.vestingContractId;
    }

    if (query.transactionId) {
      where.transactionId = query.transactionId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.chainId || query.address) {
      where.vestingContract = {};
      if (query.chainId) {
        where.vestingContract.chainId = query.chainId;
      }

      if (query.address) {
        where.vestingContract.address = {
          mode: 'insensitive',
          contains: query.address,
        };
      }
    }

    return this.vesting.getAll(where);
  }
}
