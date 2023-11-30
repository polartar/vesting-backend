import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMilestoneVestingInput } from './dto/milestone-vesting.input';
import { PrismaService } from 'nestjs-prisma';
import { RecipesService } from 'src/recipe/recipes.service';
import { Role, VestingStatus } from '@prisma/client';
import { MilestoneVestingTemplateService } from 'src/milestone-vesting-template/milestone-vesting-template.service';

@Injectable()
export class MilestoneVestingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recipeService: RecipesService,
    private readonly templateService: MilestoneVestingTemplateService
  ) {}

  async create(data: CreateMilestoneVestingInput) {
    try {
      let template;
      if (data.template) {
        template = await this.templateService.create({
          name: data.template,
          organizationId: data.organizationId,
          milestones: data.milestones,
        });
      }

      const milestoneVesting = await this.prisma.milestoneVesting.create({
        data: {
          organizationId: data.organizationId,
          vestingContractId: data.vestingContractId,
          status: data.status ?? VestingStatus.INITIALIZED,
          type: data.type,
          templateId: template ? template.id : null,
        },
      });

      await Promise.all(
        data.milestones.map(async (milestone) => {
          return await this.prisma.milestone.create({
            data: {
              allocation: milestone.allocation,
              description: milestone.description,
              releaseFreq: milestone.releaseFreq,
              title: milestone.title,
              vestingId: milestoneVesting.id,
              duration: milestone.duration,
            },
          });
        })
      );

      const recipe = await this.prisma.recipe.findFirst({
        where: {
          email: data.recipientEmail,
          name: data.recipientName,
          organizationId: data.organizationId,
          // wallet: {
          //   address: data.recipientAddress.toLowerCase(),
          // },
        },
      });

      if (!recipe) {
        await this.recipeService.create({
          allocations: data.allocation,
          organizationId: data.organizationId,
          name: data.recipientName,
          email: data.recipientEmail,
          role: Role.INVESTOR,
          milestoneVestingId: milestoneVesting.id,
          redirectUri: data.redirectUri,
          address: data.recipientAddress.toLowerCase(),
        });
      }
      return milestoneVesting;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async get(vestingId: string) {
    return this.prisma.milestoneVesting.findUnique({
      where: { id: vestingId },
      include: {
        milestones: true,
        recipes: true,
      },
    });
  }

  async getVestingsByOrganization(organizationId: string) {
    return this.prisma.milestoneVesting.findMany({
      where: {
        organizationId,
      },
      include: {
        vestingContract: true,
      },
    });
  }
}
