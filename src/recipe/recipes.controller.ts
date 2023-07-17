import {
  Controller,
  BadRequestException,
  UseGuards,
  Get,
  Put,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import {
  NormalAuth,
  OrganizationFounderAuth,
  PublicAuth,
} from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import {
  ListRecipientsQueryInput,
  UpdateRecipeInput,
} from './dto/recipe.input';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/messages';
import { IRecipientsQuery } from './dto/interface';

@Controller('recipe')
export class RecipesController {
  constructor(private readonly recipe: RecipesService) {}

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/get/:recipeId')
  async getRecipe(@Param('recipeId') recipeId: string) {
    return this.recipe.get(recipeId);
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/:recipeId')
  async updateRecipe(
    @Param('recipeId') recipeId: string,
    @Body() body: UpdateRecipeInput
  ) {
    const recipe = await this.recipe.update(recipeId, body);
    if (!recipe) {
      throw new NotFoundException(
        ERROR_MESSAGES.RECIPIENT_NO_PENDING_INVITATION
      );
    }

    return recipe;
  }

  @ApiBearerAuth()
  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/code/:code')
  async getRecipeByCode(@Param('code') code: string) {
    return this.recipe.getByCode(code);
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/revoke/:recipeId')
  async revokeRecipe(
    @Param('recipeId') recipeId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _: UpdateRecipeInput
  ) {
    try {
      await this.recipe.revokeRecipe(recipeId);
      return SUCCESS_MESSAGES.RECIPIENT_REVOKE;
    } catch (error) {
      console.error('PUT /recipe/revoke/:recipeId', error);
      throw new BadRequestException(ERROR_MESSAGES.RECIPIENT_REVOKE_FAILURE);
    }
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/list')
  async getRecipientList(@Query() query: ListRecipientsQueryInput) {
    try {
      const where: IRecipientsQuery = {
        organizationId: query.organizationId,
      };

      if (query.vestingId) {
        where.vestingId = query.vestingId;
      }

      if (query.status) {
        where.status = query.status;
      }

      if (query.address) {
        where.address = {
          mode: 'insensitive',
          contains: query.address,
        };
      }

      if (query.email) {
        where.user = {};

        where.user.email = {
          mode: 'insensitive',
          contains: query.email,
        };
      }

      if (query.chainId || query.vestingContractId || query.tokenId) {
        where.vesting = {};

        if (query.vestingContractId) {
          where.vesting.vestingContractId = query.vestingContractId;
        }

        if (query.chainId || query.tokenId) {
          where.vesting.vestingContract = {};

          if (query.chainId) {
            where.vesting.vestingContract.chainId = +query.chainId;
          }

          if (query.tokenId) {
            where.vesting.vestingContract.tokenId = query.tokenId;
          }
        }
      }

      return this.recipe.getAll(where);
    } catch (error) {
      console.log('GET /recipe/list', error);
      throw new BadRequestException(ERROR_MESSAGES.RECIPIENT_GET_ALL);
    }
  }
}
