import { Optional } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '@prisma/client';

@InputType()
export class CreateTransactionInput {
  @ApiProperty()
  @Field(() => String)
  @Optional()
  hash?: string;

  @ApiProperty()
  @Field(() => Number)
  chainId: number;

  @ApiProperty()
  @Field(() => TransactionStatus)
  status: TransactionStatus;
}
