import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CreateVestingContractInput,
  DeployVestingContractInput,
} from './dto/vesting-contracts.input';
import { VestingContractStatus } from '@prisma/client';

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

    return this.prisma.vestingContract.create({
      data: payload,
    });
  }

  async get(vestingContractId: string) {
    return this.prisma.vestingContract.findUnique({
      where: {
        id: vestingContractId,
      },
      include: {
        organization: true,
        token: true,
        vestings: true,
      },
    });
  }

  async update(
    vestingContractId: string,
    payload: Partial<CreateVestingContractInput>
  ) {
    const { organizationId: _, ...data } = payload;
    return this.prisma.vestingContract.update({
      where: {
        id: vestingContractId,
      },
      data,
    });
  }

  async deploy(vestingContractId: string, data: DeployVestingContractInput) {
    return this.prisma.vestingContract.update({
      where: { id: vestingContractId },
      data,
    });
  }

  async getByOrganization(organizationId: string) {
    return this.prisma.vestingContract.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      include: {
        token: true,
      },
    });
  }
}
