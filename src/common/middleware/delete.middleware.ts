import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export function softDeleteMiddleware(): Prisma.Middleware {
  return async () => {
    prisma.$use(async (params, next) => {
      switch (params.action) {
        case 'delete':
          params.action = 'update';
          params.args['data'] = { deletedAt: new Date() };
          break;
        case 'deleteMany':
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args.data['deleted'] = true;
          } else {
            params.args['data'] = { deletedAt: new Date() };
          }
          break;
        case 'count':
        case 'findFirst':
        case 'findMany':
        case 'findUnique':
          params.args['where'].deletedAt = null;
      }

      return next(params);
    });
  };
}
