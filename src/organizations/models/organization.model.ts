import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

import { BaseModel } from 'src/common/models/base.model';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Organization extends BaseModel {
  @Field(() => String)
  userId: string;

  @Field(() => User)
  user: User;

  @Field(() => String)
  name: string;

  @Field(() => String)
  @IsEmail()
  email: string;
}
