import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

import { BaseModel } from 'src/common/models/base.model';
import { Wallet } from 'src/wallets/models/wallets.model';
import { UserRole } from './user-role.model';
import { Recipe } from 'src/recipe/model/recipe.model';

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
  Wallets: Wallet[];

  @Field(() => Array<UserRole>)
  Roles: UserRole[];

  @Field(() => Array<Recipe>)
  Recipes: Recipe[];
}
