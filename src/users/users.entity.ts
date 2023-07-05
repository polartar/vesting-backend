import { Optional } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';

@ObjectType()
export class UserEntity extends CommonEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Field(() => String)
  @ApiProperty()
  @Expose()
  name: string;

  @Field(() => String)
  @ApiProperty()
  @Expose()
  @IsEmail()
  email: string;

  @Field(() => Boolean)
  @ApiProperty()
  @Expose()
  isActive: boolean;

  @Field(() => Boolean)
  @ApiProperty()
  @Expose()
  isAdmin: boolean;

  @Field(() => String)
  @ApiProperty()
  @Expose()
  @Optional()
  firebaseId: string;
}
