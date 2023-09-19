import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { generateApiKey } from 'src/common/utils/helpers';

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(organizationId: string) {
    const key = generateApiKey();

    const membership = await this.prisma.membership.create({
      data: {
        organizationId,
        key,
      },
    });
    return membership;
  }

  async getByKey(key: string) {
    const membership = await this.prisma.membership.findFirstOrThrow({
      where: {
        key,
      },
    });
    return membership;
  }
}
