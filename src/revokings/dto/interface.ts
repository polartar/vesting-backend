import { Revoking } from '@prisma/client';

export type IRevokingsQuery = Partial<
  Modify<
    Revoking,
    {
      recipe: {
        address: InsensitiveQuery;
      };
    }
  >
>;
