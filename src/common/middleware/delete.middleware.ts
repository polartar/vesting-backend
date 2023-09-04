import { Prisma } from '@prisma/client';
import { SOFT_DELETABLE_MODELS } from '../utils/api';

export function softDeleteMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const model = params.model as string;
    if (SOFT_DELETABLE_MODELS.includes(model)) {
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
          params.args['where'].deletedAt = null;
          break;
      }
    }

    const result = await next(params);
    return result;
  };
}
