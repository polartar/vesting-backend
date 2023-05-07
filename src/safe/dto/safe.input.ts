import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ConfirmationStatus } from '@prisma/client';
import { IsArray, IsEthereumAddress } from 'class-validator';

@InputType()
export class CreateSafeWalletInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => Number)
  chainId: number;

  @ApiProperty()
  @IsEthereumAddress()
  @Field(() => String)
  address: string;

  @ApiProperty()
  @Field(() => Number)
  requiredConfirmations: number;
}

@InputType()
export class CreateSafeOwnersInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsArray()
  @IsEthereumAddress({ each: true })
  @Field(() => Array)
  addresses: string[];

  @ApiProperty()
  @Field(() => String)
  safeWalletId: string;
}

@InputType()
export class CreateSafeConfirmationInput {
  @ApiProperty()
  @IsEthereumAddress()
  @Field(() => String)
  address: string;

  @ApiProperty()
  @Field(() => String)
  safeWalletId: string;

  @ApiProperty()
  @Field(() => String)
  safeOwnerId: string;

  @ApiProperty()
  @Field(() => String)
  transactionId: string;

  @ApiProperty()
  @Field(() => ConfirmationStatus)
  status: ConfirmationStatus;
}
