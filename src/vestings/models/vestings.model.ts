import 'reflect-metadata';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Optional } from '@nestjs/common';
import { BaseModel } from 'src/common/models/base.model';
import { Organization } from 'src/organizations/models/organizations.model';
import { Token } from 'src/tokens/models/tokens.model';
import { ReleaseFrequencyType, CliffDurationType } from '@prisma/client';
import { Transaction } from 'src/transactions/models/transactions.model';

registerEnumType(ReleaseFrequencyType, {
  name: 'ReleaseFrequencyType',
  description: 'Release frequency types',
});

registerEnumType(CliffDurationType, {
  name: 'CliffDurationType',
  description: 'Cliff duration types',
});

@ObjectType()
export class Vesting extends BaseModel {
  @Field(() => String)
  organizationId: string;

  @Field(() => Organization)
  organization: Organization;

  @Field(() => String)
  tokenId: string;

  @Field(() => Token)
  token: Token;

  @Field(() => String)
  name: string;

  @Field(() => Date)
  startedAt: Date;

  @Field(() => Date)
  endedAt: Date;

  @Field(() => ReleaseFrequencyType, { defaultValue: 'CONTINUOUS' })
  releaseFrequencyType: ReleaseFrequencyType;

  @Field(() => Number)
  releaseFrequency: number;

  @Field(() => CliffDurationType, { defaultValue: 'NO_CLIFF' })
  cliffDurationType: CliffDurationType;

  @Field(() => Number, { defaultValue: 0 })
  cliffDuration: number;

  @Field(() => String, { defaultValue: '0' })
  cliffAmount: string;

  @Field(() => String)
  amount: string;

  @Field(() => String)
  @Optional()
  transactionId?: string;

  @Field(() => String)
  @Optional()
  Transaction?: Transaction;
}
