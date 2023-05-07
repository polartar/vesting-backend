import 'reflect-metadata';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

import { BaseModel } from 'src/common/models/base.model';
import { Optional } from '@nestjs/common';
import { TransactionStatus } from '@prisma/client';

registerEnumType(TransactionStatus, {
  name: 'Transaction status',
  description: 'Transaction status',
});

@ObjectType()
export class Transaction extends BaseModel {
  @Field(() => String)
  @Optional()
  hash?: string;

  @Field(() => TransactionStatus, { defaultValue: 'DRAFT' })
  status: TransactionStatus;

  @Field(() => Number)
  chainId: number;
}
