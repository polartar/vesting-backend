import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsNumberString,
  IsEthereumAddress,
} from 'class-validator';

@InputType()
export class CreateRevokingInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  recipeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  chainId: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TransactionStatus)
  @Field(() => TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  transactionId: string;
}

@InputType()
export class UpdateRevokingInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  transactionId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TransactionStatus)
  @Field(() => TransactionStatus)
  status: TransactionStatus;
}

@InputType()
export class QueryRevokingsInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  organizationId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  transactionId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  vestingId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  recipeId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  @Field(() => String)
  chainId?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TransactionStatus)
  @Field(() => TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  @IsOptional()
  recipient?: string;
}
