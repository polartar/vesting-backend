import { PrismaService } from 'nestjs-prisma';
import { Injectable } from '@nestjs/common';
import { CreateTokenInput } from './dto/token.input';

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
}
