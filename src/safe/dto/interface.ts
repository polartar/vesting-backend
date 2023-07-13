import { SafeWallet } from '@prisma/client';

export type ISafeQuery = Partial<
  Modify<
    SafeWallet,
    {
      address: InsensitiveQuery;
    }
  >
>;
