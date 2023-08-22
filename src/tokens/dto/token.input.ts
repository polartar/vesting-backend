import { Optional } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateTokenInput {
  @ApiProperty()
  @IsNotEmpty()
  @Field(() => String)
  @IsString()
  organizationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Field(() => String)
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Field(() => String)
  @IsString()
  symbol: string;

  @ApiProperty()
  @IsNotEmpty()
  @Field(() => Number)
  @IsNumber()
  decimal: number;

  @ApiProperty()
  @Field(() => String)
  @IsString()
  @Optional()
  description?: string;

  @ApiProperty()
  @Field(() => String)
  @Optional()
  @IsNumberString()
  maxSupply?: string;

  @ApiProperty()
  @Field(() => String)
  @Optional()
  @IsNumberString()
  totalSupply?: string;

  @ApiProperty()
  @Field(() => String)
  @Optional()
  @IsString()
  supplyCap?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  burnable: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  imported: boolean;

  @ApiProperty()
  @Field(() => Number)
  @IsNumber()
  @IsOptional()
  chainId: SupportedChainIds;

  @ApiProperty()
  @Field(() => String)
  @IsEthereumAddress()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @Field(() => String)
  @Optional()
  @IsString()
  logo?: string;
}

@InputType()
export class UpdateTokenInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  organizationId: string;

  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  @IsNumberString()
  totalSupply: string;
}

@InputType()
export class ImportTokenInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => Number)
  chainId: SupportedChainIds;

  @ApiProperty()
  @Field(() => String)
  @Optional()
  logo?: string;

  @ApiProperty()
  @Field(() => String)
  address: string;

  @ApiProperty()
  @Field(() => Boolean)
  burnable: boolean;
}

@InputType()
export class CreateDeployedTokenInput extends ImportTokenInput {
  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @Field(() => String)
  symbol: string;

  @ApiProperty()
  @Field(() => Number)
  decimal: number;

  @ApiProperty()
  @Field(() => Boolean)
  isDeployed: boolean;
}
