import { User } from '@prisma/client';

export type IUserQuery = Partial<
  Modify<
    User,
    {
      email: InsensitiveQuery;
    }
  > & {
    wallets: {
      some: {
        address: InsensitiveQuery;
      };
    };
  }
>;
