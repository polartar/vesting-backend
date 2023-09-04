import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class VestingContractsMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: () => void) {
    const { organizationId, tokenId } = req.body as unknown as {
      organizationId: string;
      tokenId: string;
    };
    if (!organizationId || !tokenId) {
      return next();
    }

    const organizationTokenExists =
      await this.prisma.organizationToken.findFirst({
        where: {
          organizationId,
          tokenId,
        },
      });

    if (!organizationTokenExists) {
      throw new BadRequestException(
        `${tokenId} token is not existed in ${organizationId} organization.`
      );
    }

    return next();
  }
}
