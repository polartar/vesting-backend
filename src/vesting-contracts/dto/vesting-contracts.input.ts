import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { VestingContractStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

registerEnumType(VestingContractStatus, {
  name: 'VestingContract statuses',
  description: 'VestingContract statuses',
});

@InputType()
export class CreateVestingContractInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => String)
  tokenId: string;

  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @Field(() => String)
  address?: string;

  @ApiProperty()
  @Field(() => String)
  transactionId?: string;

  @ApiProperty()
  @Field(() => Number)
  chainId: number;
}

@InputType()
export class DeployVestingContractInput {
  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String)
  address?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  chainId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(VestingContractStatus)
  @Field(() => VestingContractStatus)
  status: VestingContractStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isDeployed: boolean;
}
