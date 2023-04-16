import 'reflect-metadata';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

import { BaseModel } from 'src/common/models/base.model';
import { Organization } from 'src/organizations/models/organizations.model';
import { Token } from 'src/tokens/models/tokens.model';

@ObjectType()
export class VestingContract extends BaseModel {
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

  @Field(() => Boolean, { defaultValue: false })
  isDeployed: boolean;

  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;
}
