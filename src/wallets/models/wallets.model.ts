import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';

import { BaseModel } from 'src/common/models/base.model';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Wallet extends BaseModel {
  @Field(() => String)
  @IsEthereumAddress()
  address: string;

  @Field(() => String)
  userId: string;

  @Field(() => User)
  user: User;
}
