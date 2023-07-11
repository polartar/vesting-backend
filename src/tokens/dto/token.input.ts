import { Optional } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

@InputType()
export class CreateTokenInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

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
  @Field(() => String)
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
  supplyCap?: string;

  @ApiProperty()
  @Field(() => Boolean)
  @IsNumberString()
  burnable: boolean;

  @ApiProperty()
  @Field(() => Boolean)
  @IsNumberString()
  imported: boolean;

  @ApiProperty()
  @Field(() => Number)
  @Optional()
  chainId: SupportedChainIds;

  @ApiProperty()
  @Field(() => String)
  @Optional()
  logo: string;
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
