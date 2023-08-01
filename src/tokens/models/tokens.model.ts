import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';

import { BaseModel } from 'src/common/models/base.model';
import { Optional } from '@nestjs/common';
import { Transaction } from 'src/transactions/models/transactions.model';

@ObjectType()
export class Token extends BaseModel {
  @Field({
    description: 'Identifies the date and time when the object was deleted.',
  })
  deletedAt: Date;

  @Field(() => String)
  name: string;

  @Field(() => String)
  symbol: string;

  @Field(() => String)
  @Optional()
  description?: string;

  @Field(() => String)
  @Optional()
  maxSupply?: string;

  @Field(() => Number)
  @Optional()
  chainId?: number;

  @Field(() => String)
  @Optional()
  address?: string;

  @Field(() => String)
  @Optional()
  logo?: string;

  @Field(() => String)
  @Optional()
  transactionId?: string;

  @Field(() => String)
  @Optional()
  Transaction?: Transaction;

  @Field(() => Boolean, { defaultValue: false })
  isDeployed: boolean;
}
