import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateRecipeInput } from './dto/recipe.input';
import { EmailService } from 'src/auth/email.service';
import { generateRandomCode } from 'src/common/utils/helpers';
import { Recipe, RecipeStatus } from '@prisma/client';
import { IRecipientsQuery } from './dto/interface';

@Injectable()
export class RecipesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService
  ) {}

  async create({ email, redirectUri, ...payload }: CreateRecipeInput) {
    const code = generateRandomCode();
    const recipe = await this.prisma.recipe.create({
      data: {
        ...payload,
        code,
        status: 'PENDING',
      },
    });

    await this.email.sendInvitationEmail(email, code, redirectUri);
    return recipe;
  }

  async get(recipeId: string) {
    return this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        // TODO add relations
      },
    });
  }

  async getByCode(code: string) {
    return this.prisma.recipe.findUnique({
      where: {
        code,
      },
    });
  }

  async update(recipeId: string, data: Partial<Recipe>) {
    return this.prisma.recipe.update({
      where: { id: recipeId },
      data,
    });
  }

  async revokeRecipe(recipeId: string) {
    const recipe = await this.update(recipeId, {
      status: RecipeStatus.REVOKED,
    });
    await this.prisma.userRole.deleteMany({
      where: {
        userId: recipe.userId,
        organizationId: recipe.organizationId,
        role: recipe.role,
      },
    });
  }

  async getAll(where: IRecipientsQuery) {
    return this.prisma.recipe.findMany({
      where,
      include: {
        vesting: {
          include: {
            vestingContract: true,
          },
        },
        user: true,
      },
    });
  }
}
