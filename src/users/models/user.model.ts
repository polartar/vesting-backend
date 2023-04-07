import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

import { BaseModel } from 'src/common/models/base.model';
import { Wallet } from 'src/wallets/models/wallets.model';
import { UserRole } from './user-role.model';

@ObjectType()
export class User extends BaseModel {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isAdmin: boolean;

  @Field(() => Array<Wallet>)
  wallets: Wallet[];

  @Field(() => Array<UserRole>)
  roles: UserRole[];
}
