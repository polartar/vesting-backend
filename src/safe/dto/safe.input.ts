import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ConfirmationStatus } from '@prisma/client';
import {
  IsArray,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateSafeWalletDetailInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty()
  @Field(() => String)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @Field(() => Number)
  @IsNotEmpty()
  chainId: SupportedChainIds;

  @ApiProperty()
  @IsEthereumAddress()
  @Field(() => String)
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @Field(() => Number)
  @IsNotEmpty()
  requiredConfirmations: number;
}

@InputType()
export class CreateSafeOwnerInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @ApiProperty()
  @Field(() => String)
  @IsOptional()
  @IsString()
  name?: string;
}

@InputType()
export class CreateSafeWalletInput extends CreateSafeWalletDetailInput {
  @ApiProperty()
  @Field(() => Array)
  @IsNotEmpty()
  @IsArray()
  owners: CreateSafeOwnerInput[];
}

@InputType()
export class CreateSafeConfirmationInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  safeWalletId: string;

  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  safeOwnerId: string;

  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty()
  @Field(() => ConfirmationStatus)
  @IsNotEmpty()
  status: ConfirmationStatus;
}

@InputType()
export class QuerySafeInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String)
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  @Field(() => Number)
  chainId?: string;
}
