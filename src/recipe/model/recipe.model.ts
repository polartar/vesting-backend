import 'reflect-metadata';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

import { BaseModel } from 'src/common/models/base.model';
import { Vesting } from 'src/vestings/models/vestings.model';
import { User } from 'src/users/models/user.model';

import { RecipeStatus } from '@prisma/client';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

registerEnumType(RecipeStatus, {
  name: 'Recipe Status',
  description: 'Recipient participation status',
});

@ObjectType()
export class Recipe extends BaseModel {
  @Field({
    description: 'Identifies the date and time when the object was deleted.',
  })
  deletedAt: Date;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  vestingId: string;

  @Field(() => Vesting)
  @IsString()
  @IsNotEmpty()
  vesting: Vesting;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsEthereumAddress()
  @IsOptional()
  address?: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => User)
  user?: User;

  @Field(() => String)
  @IsNumberString()
  @IsNotEmpty()
  allocations: string;

  @Field(() => RecipeStatus, { defaultValue: 'PENDING' })
  @IsEnum(RecipeStatus)
  @IsNotEmpty()
  status: RecipeStatus;
}
