import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';

import { BaseModel } from 'src/common/models/base.model';
import { Organization } from 'src/organizations/models/organizations.model';
import { Transaction } from 'src/transactions/models/transactions.model';
import { Optional } from '@nestjs/common';

@ObjectType()
export class SafeWallet extends BaseModel {
  @Field(() => Number)
  chainId: number;

  @Field(() => String)
  @Optional()
  name?: string;

  @Field(() => String)
  @IsEthereumAddress()
  address: string;

  @Field(() => String)
  organizationId: string;

  @Field(() => Organization)
  Organization: Organization;

  @Field(() => Number)
  requiredConfirmations: number;

  @Field(() => String)
  @Optional()
  transactionId?: string;

  @Field(() => Transaction)
  @Optional()
  Transaction?: Transaction;
}
