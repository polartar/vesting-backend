import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';

import { BaseModel } from 'src/common/models/base.model';
import { Optional } from '@nestjs/common';

@ObjectType()
export class Token extends BaseModel {
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

  @Field(() => Boolean, { defaultValue: false })
  isDeployed: boolean;

  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;
}
