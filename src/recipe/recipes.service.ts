import { PrismaService } from 'nestjs-prisma';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BulkCreateRecipesInput, CreateRecipeInput } from './dto/recipe.input';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRecipeInput) {
    return this.prisma.recipe.create({
      data,
    });
  }

  async bulkCreate(payload: BulkCreateRecipesInput) {
    const { organizationId, recipes } = payload;
    const data = recipes.filter(
      (recipe) => recipe.organizationId === organizationId
    );
    if (data.length !== recipes.length) {
      throw new BadRequestException('Wrong organizationId is provided');
    }

    return this.prisma.recipe.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async get(recipeId: string) {
    return this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        // TODO add relations
      },
    });
  }
}
