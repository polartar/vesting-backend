import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateProjectInput, QueryProjectInput } from './dto/project.input';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ entityIds, ...data }: CreateProjectInput) {
    const project = await this.prisma.project.create({
      data: {
        ...data,
        chainId: data.chainId ?? 0,
        contract: data.contract ?? '',
        wallet: data.wallet ?? '',
      },
    });

    await this.prisma.projectEntity.createMany({
      data: entityIds.map((entityId) => ({
        entityId,
        projectId: project.id,
      })),
    });

    return project;
  }

  async getAll(query: QueryProjectInput) {
    const where: Partial<Project> = {
      organizationId: query.organizationId,
    };

    if (query.wallet) {
      where.wallet = query.wallet;
    }

    if (query.contract) {
      where.contract = query.contract;
    }

    if (query.chainId) {
      where.chainId = query.chainId;
    }

    if (query.onlyLive) {
      where.isLive = true;
    }

    return this.prisma.project.findMany({
      where,
      include: {
        projectEntities: {
          include: {
            entity: true,
          },
        },
      },
    });
  }
}
