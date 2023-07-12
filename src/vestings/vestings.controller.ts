import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { VestingsService } from './vestings.service';
import { NormalAuth, OrganizationFounderAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { CreateVestingInput } from './dto/vestings.input';
import { UsersService } from 'src/users/users.service';
import { RecipesService } from 'src/recipe/recipes.service';

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
}
