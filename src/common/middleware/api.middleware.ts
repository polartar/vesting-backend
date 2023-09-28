import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { ERROR_MESSAGES } from '../utils/messages';

@Injectable()
export class ApiMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: () => void) {
    const key = req.headers?.['api-key'] as string;

    if (!key) {
      // TODO: consider the case if api key is not provided
      // throw new BadRequestException(ERROR_MESSAGES.AUTH_NO_API_KEY);
      return next();
    }

    const membership = await this.prisma.membership.findFirst({
      where: {
        key,
      },
    });
    if (!membership) {
      throw new BadRequestException(ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND);
    }

    // TODO: improve any type
    (req as any).organizationId = membership.organizationId;

    return next();
  }
}
