import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateProjectInput, QueryProjectInput } from './dto/project.input';
import { Project } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async notifySlack(organizationId: string, name: string) {
    try {
      await axios.post(process.env.SLACK_NEW_PROJECT_WEBHOOK_URL, {
        username: organizationId, // This will appear as user name who posts the message
        text: `Project (${name}) just created`,
        icon_emoji: ':new:', // User icon, you can also use custom icons here
        attachments: [
          {
            color: '#eed140', // color of the attachments sidebar.
            fields: [
              {
                title: 'Project Name',
                value: name,
                short: true,
              },
              {
                title: 'Organization',
                value: organizationId,
                short: true,
              },
            ],
          },
        ],
      });
    } catch (err: any) {}
  }

  async create({ entityIds, ...data }: CreateProjectInput) {
    const project = await this.prisma.project.create({
      data: {
        ...data,
        chainId: data.chainId ?? 0,
        contract: data.contract ?? '',
        wallet: data.wallet ?? '',
      },
    });
    await this.notifySlack(data.organizationId, data.name);

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
