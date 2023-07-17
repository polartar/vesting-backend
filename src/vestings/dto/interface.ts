import { Vesting, VestingContract } from '@prisma/client';

export type IVestingsQuery = Partial<
  Vesting & {
    vestingContract: Partial<
      Modify<
        VestingContract,
        {
          address: InsensitiveQuery;
        }
      >
    >;
  }
>;
