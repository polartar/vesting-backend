import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateMilestoneVestingInput,
  Milestone,
} from './dto/milestone-vesting.input';
import { PrismaService } from 'nestjs-prisma';
import { RecipesService } from 'src/recipe/recipes.service';
import { Role, VestingStatus } from '@prisma/client';
import { VestingContractsService } from 'src/vesting-contracts/vesting-contracts.service';
import { MilestoneVestingTemplateService } from 'src/milestone-vesting-template/milestone-vesting-template.service';

@Injectable()
export class MilestoneVestingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recipeService: RecipesService,
    private readonly vestingContractService: VestingContractsService,
    private readonly templateService: MilestoneVestingTemplateService
  ) {}

  validateMilestoneDurationJson(milestones: Milestone[]) {
    for (const milestone of milestones) {
      try {
        const duration = JSON.parse(milestone.duration);
        if (typeof duration === 'object') {
          if (
            !isNaN(duration.value) ||
            (duration.type !== 'month' && duration.type != 'year')
          ) {
            throw 'Invalid duration type or value';
          }
        } else {
          throw 'Not object';
        }
      } catch (err) {
        return false;
      }
    }
    return true;
  }
  async create(data: CreateMilestoneVestingInput) {
    if (!this.validateMilestoneDurationJson(data.milestones)) {
      throw new BadRequestException('Invalid milestone duration.');
    }
    const vestingContract = await this.vestingContractService.get(
      data.vestingContractId
    );
    if (!vestingContract) {
      throw new BadRequestException(
        `Vesting contract(${data.vestingContractId}) not exists`
      );
    }

    const template = await this.templateService.create({
      name: data.templateName,
      organizationId: data.organizationId,
      milestones: data.milestones,
    });

    const milestoneVesting = await this.prisma.milestoneVesting.create({
      organizationId: data.organizationId,
      vestingContract,
      status: data.status ?? VestingStatus.INITIALIZED,
      type: data.type,
      template: template,
    });

    await Promise.all(
      data.milestones.map(async (milestone) => {
        return await this.prisma.milestone.create({
          allocation: milestone.allocation,
          description: milestone.description,
          releaseFreq: milestone.releaseFreq,
          vesting: milestoneVesting,
          duration: JSON.parse(milestone.duration),
        });
      })
    );

    const recipe = await this.prisma.recipe.findFirst({
      where: {
        email: data.recipientEmail,
        name: data.recipientName,
        organizationId: data.organizationId,
        wallet: {
          address: data.recipientWalletAddress.toLowerCase(),
        },
      },
    });

    if (!recipe) {
      this.recipeService.create({
        allocations: data.allocation,
        organizationId: data.organizationId,
        name: data.recipientName,
        email: data.recipientEmail,
        role: Role.INVESTOR,
        milestoneVesting: milestoneVesting,
        redirectUri: data.redirectUri,
        address: data.recipientWalletAddress.toLowerCase(),
      });
    }
    return milestoneVesting;
  }
}
