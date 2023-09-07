import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { VestingContractStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

registerEnumType(VestingContractStatus, {
  name: 'VestingContract statuses',
  description: 'VestingContract statuses',
});

@InputType()
export class CreateVestingContractInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  tokenId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String)
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  transactionId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  chainId: number;
}

@InputType()
export class UpdateVestingContractInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String)
  tokenId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String)
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  transactionId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
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

@InputType()
export class QueryVestingContractsInput {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String)
  organizationId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String)
  tokenId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  @Field(() => String)
  chainId?: string;
}
