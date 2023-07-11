import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';

import { CreateDeployedTokenInput, CreateTokenInput } from './dto/token.input';
import { Token } from './models/tokens.model';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateTokenInput) {
    const { organizationId, ...data } = payload;
    const token = await this.prisma.token.create({
      data,
    });

    await this.prisma.organizationToken.create({
      data: {
        tokenId: token.id,
        organizationId,
      },
    });

    return token;
  }

  async import(payload: CreateDeployedTokenInput) {
    const { organizationId, ...data } = payload;
    const prevToken = await this.prisma.token.findFirst({
      where: {
        address: data.address,
      },
    });

    let token: Token;
    if (prevToken) {
      token = prevToken;
    } else {
      token = await this.prisma.token.create({
        data: {
          ...data,
          imported: true,
        },
      });
    }

    const prevOrganizationToken = await this.prisma.organizationToken.findFirst(
      {
        where: {
          tokenId: token.id,
          organizationId,
        },
      }
    );

    if (!prevOrganizationToken) {
      await this.prisma.organizationToken.create({
        data: {
          tokenId: token.id,
          organizationId,
        },
      });
    }

    return token;
  }

  async get(tokenId: string) {
    return this.prisma.token.findUnique({
      where: {
        id: tokenId,
      },
      include: {
        // TODO add relations
      },
    });
  }

  async getMyTokens(userId: string) {
    const orgs = await this.prisma.userRole.groupBy({
      by: ['organizationId'],
      where: { userId },
    });
    const organizationIds = orgs.map((org) => org.organizationId);

    return this.prisma.organizationToken.findMany({
      where: {
        organizationId: {
          in: organizationIds,
        },
      },
      select: {
        token: true,
      },
    });
  }
}
