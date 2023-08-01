import { Optional } from '@nestjs/common';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus, TransactionType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsEthereumAddress,
} from 'class-validator';

registerEnumType(TransactionStatus, {
  name: 'Transaction statuses',
  description: 'Transaction statuses',
});

registerEnumType(TransactionType, {
  name: 'Transaction types',
  description: 'Transaction types',
});

@InputType()
export class CreateTransactionInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  @Field(() => String)
  to: string;

  @ApiProperty()
  @Optional()
  @IsString()
  @Field(() => String)
  hash?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  safeHash?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  chainId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  @Field(() => TransactionStatus)
  status: TransactionStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TransactionType)
  @Field(() => TransactionType)
  type: TransactionType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  vestingContractId?: string;
}

@InputType()
export class QueryTransactionsInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  organizationId?: string;

  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String)
  to?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  @Field(() => String)
  chainId?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TransactionStatus)
  @Field(() => TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TransactionType)
  @Field(() => TransactionType)
  type?: TransactionType;
}
