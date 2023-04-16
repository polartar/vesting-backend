import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { BulkCreateRecipesInput, CreateRecipeInput } from './dto/recipe.input';
import { NormalAuth, OrganizationFounderAuth } from 'src/common/utils/auth';
import { GlobalAuthGuard } from 'src/guards/global.auth.guard';

@Controller('recipe')
export class RecipesController {
  constructor(private readonly recipe: RecipesService) {}

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/')
  async createRecipe(@Body() body: CreateRecipeInput) {
    return this.recipe.create(body);
  }

  @ApiBearerAuth()
  @OrganizationFounderAuth()
  @UseGuards(GlobalAuthGuard)
  @Post('/bulk')
  async bulkCreateRecipe(@Body() body: BulkCreateRecipesInput) {
    return this.recipe.bulkCreate(body);
  }

  @ApiBearerAuth()
  @NormalAuth()
  @UseGuards(GlobalAuthGuard)
  @Get('/:recipeId')
  async getRecipe(@Param('recipeId') recipeId: string) {
    return this.recipe.get(recipeId);
  }
}
