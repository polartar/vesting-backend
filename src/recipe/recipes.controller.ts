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
  Delete,
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
  ResendInvitationInput,
  RevokeRecipeInput,
  UpdateRecipeInput,
} from './dto/recipe.input';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/utils/messages';
import { IRecipientsQuery } from './dto/interface';
import { EmailService } from 'src/auth/email.service';
import { Platforms } from 'src/common/utils/constants';

@Controller('recipe')
export class RecipesController {
  constructor(
    private readonly recipe: RecipesService,
    private readonly email: EmailService
  ) {}

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/get/:recipeId')
  async getRecipe(@Param('recipeId') recipeId: string) {
    const recipe = await this.recipe.get(recipeId);
    if (!recipe) {
      throw new NotFoundException(ERROR_MESSAGES.RECIPIENT_NOT_FOUND);
    }

    return recipe;
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
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Delete('/:recipeId')
  async deleteRecipe(@Param('recipeId') recipeId: string) {
    const recipe = await this.recipe.delete(recipeId);
    return recipe;
  }

  @ApiBearerAuth()
  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/code/:code')
  async getRecipeByCode(@Param('code') code: string) {
    const recipe = await this.recipe.getByCode(code);
    if (!recipe) {
      throw new NotFoundException(ERROR_MESSAGES.RECIPIENT_NOT_FOUND);
    }

    return recipe;
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/resend/:recipeId')
  async resendInvitation(
    @Param('recipeId') recipeId: string,
    @Body() body: ResendInvitationInput
  ) {
    const recipe = await this.recipe.getByQuery({
      id: recipeId,
      status: 'PENDING',
    });
    if (!recipe) {
      throw new NotFoundException(ERROR_MESSAGES.RECIPIENT_NOT_FOUND);
    }

    await this.email.sendInvitationEmail(
      recipe.email,
      recipe.code,
      body.redirectUri,
      Platforms.App
    );
    return recipe;
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Put('/revoke/:recipeId')
  async revokeRecipe(
    @Param('recipeId') recipeId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _: RevokeRecipeInput
  ) {
    const recipe = await this.recipe.revokeRecipe(recipeId);
    if (!recipe) {
      throw new NotFoundException(ERROR_MESSAGES.RECIPIENT_NOT_FOUND);
    }

    return SUCCESS_MESSAGES.RECIPIENT_REVOKE;
  }

  @ApiBearerAuth()
  @PublicAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/list')
  async getRecipientList(@Query() query: ListRecipientsQueryInput) {
    try {
      const where: IRecipientsQuery = {
        user: {
          deletedAt: null,
        },
        vesting: {
          deletedAt: null,
          vestingContract: {
            deletedAt: null,
          },
        },
      };

      if (query.organizationId) {
        where.organizationId = query.organizationId;
      }

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
        where.user.email = {
          mode: 'insensitive',
          contains: query.email,
        };
      }

      if (query.chainId || query.vestingContractId || query.tokenId) {
        if (query.vestingContractId) {
          where.vesting.vestingContractId = query.vestingContractId;
        }

        if (query.chainId || query.tokenId) {
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
