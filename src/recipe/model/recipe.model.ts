import 'reflect-metadata';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

import { BaseModel } from 'src/common/models/base.model';
import { Vesting } from 'src/vestings/models/vestings.model';
import { User } from 'src/users/models/user.model';

import { RecipeStatus } from '@prisma/client';

registerEnumType(RecipeStatus, {
  name: 'Recipe Status',
  description: 'Recipient participation status',
});

@ObjectType()
export class Recipe extends BaseModel {
  @Field(() => String)
  vestingId: string;

  @Field(() => Vesting)
  Vesting: Vesting;

  @Field(() => String)
  recipientId: string;

  @Field(() => User)
  Recipient: User;

  @Field(() => String)
  allocations: string;

  @Field(() => RecipeStatus, { defaultValue: 'PENDING' })
  status: RecipeStatus;
}
