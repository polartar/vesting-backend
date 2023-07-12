import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ConfirmationStatus } from '@prisma/client';
import { IsArray, IsEthereumAddress, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSafeWalletDetailInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  organizationId: string;

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
export class CreateSafeWalletInput extends CreateSafeWalletDetailInput {
  @ApiProperty()
  @Field(() => Array)
  @IsNotEmpty()
  @IsArray()
  owners: string[];
}

@InputType()
export class CreateSafeConfirmationInput {
  @ApiProperty()
  @IsEthereumAddress()
  @Field(() => String)
  @IsNotEmpty()
  address: string;

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
