import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { VestingsService } from './vestings.service';
import { NormalAuth, OrganizationFounderAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import {
  CreateVestingInput,
  UpdateVestingInput,
  VestingsQueryInput,
} from './dto/vestings.input';
import { UsersService } from 'src/users/users.service';
import { RecipesService } from 'src/recipe/recipes.service';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import { IVestingsQuery } from './dto/interface';

@Controller('vesting')
export class VestingsController {
  constructor(
    private readonly vesting: VestingsService,
    private readonly user: UsersService,
    private readonly recipe: RecipesService
  ) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createVesting(
    @Body()
    { recipes, redirectUri, ...vestingDetails }: CreateVestingInput
  ) {
    const recipientUsers = await Promise.all(
      recipes.map(({ email, name }) =>
        this.user.createUserIfNotExists(email.toLowerCase(), name || '')
      )
    );
    const vestingRecipients = recipes.map((recipient, index) => ({
      ...recipient,
      email: recipient.email.toLowerCase(),
      userId: recipientUsers[index].id,
    }));

    const vesting = await this.vesting.create(vestingDetails);

    const data = await Promise.all(
      vestingRecipients.map((recipe) =>
        this.recipe.create({
          allocations: recipe.allocations,
          userId: recipe.userId,
          organizationId: vestingDetails.organizationId,
          email: recipe.email,
          role: recipe.role,
          vestingId: vesting.id,
          redirectUri,
          address: recipe.address,
        })
      )
    );

    return data;
  }

  @ApiBearerAuth()
  @NormalAuth()
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
  @UseGuards(GlobalAuthGuard)
  @Get('/list')
  async getVestings(@Query() query: VestingsQueryInput) {
    const where: IVestingsQuery = {
      organizationId: query.organizationId,
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
