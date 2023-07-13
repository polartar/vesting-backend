import { Recipe, User, Vesting, VestingContract } from '@prisma/client';

export type IRecipientsQuery = Partial<
  Modify<
    Partial<
      Recipe & {
        vesting: Partial<
          Vesting & {
            vestingContract: Partial<VestingContract>;
          }
        >;
        user: Partial<
          Modify<
            Partial<User>,
            {
              email: InsensitiveQuery;
            }
          >
        >;
      }
    >,
    {
      address: InsensitiveQuery;
    }
  >
>;
