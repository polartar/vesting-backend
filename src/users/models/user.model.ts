import 'reflect-metadata';
import { ObjectType, registerEnumType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Role } from '@prisma/client';

import { BaseModel } from 'src/common/models/base.model';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

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
}
