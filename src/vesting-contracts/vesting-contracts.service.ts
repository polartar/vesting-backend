import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CreateVestingContractInput,
  DeployVestingContractInput,
} from './dto/vesting-contracts.input';
import { VestingContract } from '@prisma/client';

@Injectable()
export class VestingContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateVestingContractInput) {
    const token = await this.prisma.token.findUnique({
      where: { id: payload.tokenId },
    });
    if (token.chainId !== payload.chainId) {
      throw new BadRequestException(
        'token.chainId is not same as request.chainId'
      );
    }

    const address = payload.address?.toLowerCase() ?? '';
    return this.prisma.vestingContract.create({
      data: {
        ...payload,
        address,
      },
    });
  }

  async get(vestingContractId: string) {
    return this.prisma.vestingContract.findFirst({
      where: {
        id: vestingContractId,
        organization: {
          deletedAt: null,
        },
        token: {
          deletedAt: null,
        },
        vestings: {
          every: {
            deletedAt: null,
          },
        },
      },
      include: {
        organization: true,
        token: true,
        vestings: true,
      },
    });
  }

  async getAll(where: Partial<VestingContract>) {
    return this.prisma.vestingContract.findMany({
      where,
      include: {
        organization: true,
        token: true,
      },
    });
  }

  async update(
    vestingContractId: string,
    payload: Partial<CreateVestingContractInput>
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { organizationId: _, ...data } = payload;

    if (data.address) {
      data.address = data.address.toLowerCase();
    }

    return this.prisma.vestingContract.update({
      where: {
        id: vestingContractId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async deploy(vestingContractId: string, data: DeployVestingContractInput) {
    if (data.address) {
      data.address = data.address.toLowerCase();
    }

    return this.prisma.vestingContract.update({
      where: { id: vestingContractId },
      data,
    });
  }

  async getByOrganization(organizationId: string) {
    return this.prisma.vestingContract.findMany({
      where: {
        organizationId,
      },
      include: {
        token: true,
      },
    });
  }

  async setDeployTransaction(vestingContractId: string, transactionId: string) {
    return this.prisma.vestingContract.update({
      where: { id: vestingContractId },
      data: {
        transactionId,
      },
    });
  }
}
