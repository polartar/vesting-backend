import { PrismaService } from 'nestjs-prisma';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';

import {
  CreateDeployedTokenInput,
  CreateTokenInput,
  UpdateTokenInput,
} from './dto/token.input';
import { Token } from './models/tokens.model';
import { ERROR_MESSAGES } from 'src/common/utils/messages';
import { ListenerService } from 'src/listener/listener.service';
import { getAddress } from 'ethers';

@Injectable()
export class TokensService implements OnModuleInit {
  static initialized = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly listenerService: ListenerService
  ) {}

  async onModuleInit() {
    if (!TokensService.initialized) {
      const tokens = await this.getAllTokens();
      tokens.forEach((token) => {
        try {
          this.listenerService.createTransferListener(
            token.address,
            token.chainId as SupportedChainIds
          );
        } catch (err) {
          console.log(err);
        }
        return;
      });
      TokensService.initialized = true;
    }
  }

  async create(payload: CreateTokenInput) {
    const { organizationId, ...data } = payload;
    const address = data.address?.toLowerCase() ?? '';
    this.listenerService.createTransferListener(
      getAddress(address),
      payload.chainId
    );
    const token = await this.prisma.token.create({
      data: {
        ...data,
        address,
      },
    });

    await this.prisma.organizationToken.create({
      data: {
        tokenId: token.id,
        organizationId,
      },
    });

    return token;
  }

  async update(
    tokenId: string,
    { organizationId, ...payload }: UpdateTokenInput
  ) {
    const organizationToken = await this.prisma.organizationToken.findFirst({
      where: {
        organizationId,
        tokenId,
      },
    });

    if (!organizationToken) {
      throw new BadRequestException(ERROR_MESSAGES.TOKEN_NOT_FOUND);
    }

    return this.prisma.token.update({
      where: { id: tokenId },
      data: payload,
    });
  }

  async import(payload: CreateDeployedTokenInput) {
    const { organizationId, ...data } = payload;
    const address = data.address.toLowerCase();
    const prevToken = await this.prisma.token.findFirst({
      where: {
        address,
      },
    });

    let token: Token;
    if (prevToken) {
      token = prevToken;
    } else {
      token = await this.prisma.token.create({
        data: {
          ...data,
          address,
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
        organizationId: true,
      },
    });
  }

  async getAllTokens() {
    return this.prisma.token.findMany();
  }
}
