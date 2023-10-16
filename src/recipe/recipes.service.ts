import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateRecipeInput, UpdateRecipeInput } from './dto/recipe.input';
import { EmailService } from 'src/auth/email.service';
import { generateRandomCode } from 'src/common/utils/helpers';
import { Recipe, RecipeStatus } from '@prisma/client';
import { IRecipientsQuery } from './dto/interface';
import { WalletsService } from 'src/wallets/wallets.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RecipesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly walletService: WalletsService,
    private readonly userService: UsersService
  ) {}

  async create({
    email,
    redirectUri,
    name,
    tokenSymbol,
    ...payload
  }: CreateRecipeInput) {
    try {
      const code = generateRandomCode();
      const user = await this.userService.createUserIfNotExists(email, name);
      await this.walletService.findOrCreate(user.id, payload.address);
      const recipe = await this.prisma.recipe.create({
        data: {
          ...payload,
          email,
          code,
          status: 'PENDING',
        },
      });

      await this.email.sendRecipientInvitationEmail(
        email,
        code,
        redirectUri,
        name,
        tokenSymbol
      );
      return recipe;
    } catch (err) {
      throw err;
    }
  }

  async get(recipeId: string) {
    return this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        user: true,
        organization: true,
      },
    });
  }

  async delete(recipeId: string) {
    return this.prisma.recipe.delete({
      where: { id: recipeId },
    });
  }

  async getByQuery(where: Partial<Recipe>) {
    return this.prisma.recipe.findFirst({
      where,
      include: {
        user: true,
        organization: true,
      },
    });
  }

  async getByCode(code: string) {
    return this.prisma.recipe.findUnique({
      where: {
        code,
      },
      include: {
        user: true,
        organization: true,
      },
    });
  }

  async update(recipeId: string, data: UpdateRecipeInput) {
    return this.prisma.recipe.updateMany({
      where: {
        id: recipeId,
        organizationId: data.organizationId,
        vesting: {
          // TODO double check
          status: 'INITIALIZED',
        },
      },
      data,
    });
  }

  async acceptInvitation(recipeId: string, data: Partial<Recipe>) {
    return this.prisma.recipe.update({
      where: { id: recipeId },
      data,
    });
  }

  async revokeRecipe(recipeId: string) {
    const recipe = await this.prisma.recipe.update({
      where: { id: recipeId },
      data: {
        status: RecipeStatus.REVOKED,
      },
      include: {
        user: true,
      },
    });

    if (recipe?.user) {
      await this.prisma.userRole.deleteMany({
        where: {
          organizationId: recipe.organizationId,
          role: recipe.role,
          userId: recipe.user.id,
        },
      });
    }

    return recipe;
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
