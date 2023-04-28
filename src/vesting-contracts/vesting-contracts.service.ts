import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateVestingContractInput } from './dto/vesting-contracts.input';

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
        // TODO add relations
      },
    });
  }
}