import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class VestingsMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: () => void) {
    const { organizationId, vestingContractId, tokenId } =
      req.body as unknown as {
        organizationId: string;
        tokenId: string;
        vestingContractId: string;
      };

    if (!organizationId || !vestingContractId || !tokenId) {
      return next();
    }

    const vestingContract = await this.prisma.vestingContract.findFirst({
      where: {
        id: vestingContractId,
        organizationId,
        tokenId,
      },
    });
    if (!vestingContract) {
      throw new BadRequestException(
        `Relation between 'organizationId', 'vestingContractId', and 'tokenId' is invalid.`
      );
    }

    return next();
  }
}
