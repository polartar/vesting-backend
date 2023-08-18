import { Entity } from '@prisma/client';

export type IEntityQuery = Partial<
  Modify<
    Entity,
    | {
        id: {
          in: string[];
        };
      }
    | { id: string }
  >
>;
