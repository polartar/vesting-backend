import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@ObjectType()
export class CommonEntity {
  @Field(() => String)
  @ApiProperty()
  @Expose()
  id: string;

  @Field(() => Date)
  @ApiProperty()
  @Expose()
  createdAt: Date;

  @Field(() => Date)
  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
