import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateWebsiteInput } from './dto/websites.input';

@Injectable()
export class WebsiteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateWebsiteInput) {
    return this.prisma.website.create({
      data: payload,
    });
  }

  async get(websiteId: string) {
    return this.prisma.website.findUnique({
      where: {
        id: websiteId,
      },
    });
  }

  async getByOrganization(organizationId: string) {
    return this.prisma.website.findFirst({
      where: { organizationId },
      include: {
        organization: true,
      },
    });
  }
}
