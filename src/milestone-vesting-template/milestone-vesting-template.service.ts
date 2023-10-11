import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMilestoneVestingTemplateInput } from './dto/milestone-vesting-templates.input';

@Injectable()
export class MilestoneVestingTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMilestoneVestingTemplateInput) {
    const template = await this.prisma.milestoneVestingTemplate.findFirst({
      name: data.name,
      organizationId: data.organizationId,
    });
    if (template) {
      return template;
    }
    await Promise.all(
      data.milestones.map(async (milestone) => {
        return await this.prisma.milestone.create({
          allocation: milestone.allocation,
          description: milestone.description,
          releaseFreq: milestone.releaseFreq,
          duration: JSON.parse(milestone.duration),
        });
      })
    );
    return await this.prisma.milestoneVestingTemplate.create({
      name: data.name,
      orientationId: data.organizationId,
    });
  }

  async get(templateId: string) {
    return this.prisma.milestoneVestingTemplate.findUnique({
      where: {
        id: templateId,
      },
    });
  }
}
