import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';

import { Optional } from '@nestjs/common';
import { BaseModel } from 'src/common/models/base.model';
import { Organization } from 'src/organizations/models/organizations.model';
import { Token } from 'src/tokens/models/tokens.model';
import { Transaction } from 'src/transactions/models/transactions.model';

@ObjectType()
export class VestingContract extends BaseModel {
  @Field({
    description: 'Identifies the date and time when the object was deleted.',
  })
  deletedAt: Date;

  @Field(() => String)
  organizationId: string;

  @Field(() => Organization)
  organization: Organization;

  @Field(() => String)
  tokenId: string;

  @Field(() => Token)
  token: Token;

  @Field(() => String)
  address?: string;

  @Field(() => String)
  transaction?: string;

  @Field(() => Number)
  chainId?: number;

  @Field(() => String)
  @Optional()
  transactionId?: string;

  @Field(() => String)
  @Optional()
  Transaction?: Transaction;

  @Field(() => Boolean, { defaultValue: false })
  isDeployed: boolean;
}
