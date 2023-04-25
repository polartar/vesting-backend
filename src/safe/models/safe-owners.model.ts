import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';

import { BaseModel } from 'src/common/models/base.model';
import { SafeWallet } from './safe-wallets.model';

@ObjectType()
export class SafeOwner extends BaseModel {
  @Field(() => String)
  @IsEthereumAddress()
  address: string;

  @Field(() => String)
  safeWalletId: string;

  @Field(() => SafeWallet)
  SafeWallet: SafeWallet;
}
