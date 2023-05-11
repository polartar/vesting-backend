import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateVestingTemplateInput } from './dto/vesting-templates.input';

@Injectable()
export class VestingTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateVestingTemplateInput) {
    return this.prisma.vestingTemplate.create({
      data: payload,
    });
  }

  async get(vestingTemplateId: string) {
    return this.prisma.vestingTemplate.findUnique({
      where: {
        id: vestingTemplateId,
      },
    });
  }
}
