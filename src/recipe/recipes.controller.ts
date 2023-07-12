import { Controller, UseGuards, Get, Put, Param, Body } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import {
  NormalAuth,
  OrganizationFounderAuth,
  PublicAuth,
} from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';
import { RevokeRecipeInput } from './dto/recipe.input';
import { RecipeStatus } from '@prisma/client';

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
    @Body() _: RevokeRecipeInput
  ) {
    return this.recipe.update(recipeId, { status: RecipeStatus.REVOKED });
  }
}
