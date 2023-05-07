import 'reflect-metadata';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { ConfirmationStatus } from '@prisma/client';

import { BaseModel } from 'src/common/models/base.model';
import { SafeWallet } from './safe-wallets.model';
import { SafeOwner } from './safe-owners.model';
import { Transaction } from 'src/transactions/models/transactions.model';

registerEnumType(ConfirmationStatus, {
  name: 'Safe confirmation status',
  description: 'Safe transaction confirmation status',
});

@ObjectType()
export class SafeConfirmation extends BaseModel {
  @Field(() => String)
  @IsEthereumAddress()
  address: string;

  @Field(() => String)
  safeWalletId: string;

  @Field(() => SafeWallet)
  SafeWallet: SafeWallet;

  @Field(() => String)
  safeOwnerId: string;

  @Field(() => SafeOwner)
  SafeOwner: SafeOwner;

  @Field(() => String)
  transactionId: string;

  @Field(() => Transaction)
  Transaction: Transaction;

  @Field(() => ConfirmationStatus)
  status: ConfirmationStatus;
}
