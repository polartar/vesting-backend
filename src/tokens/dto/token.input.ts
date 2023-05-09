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
  @Field(() => String)
  @Optional()
  description?: string;

  @ApiProperty()
  @Field(() => String)
  @Optional()
  @IsNumberString()
  maxSupply?: string;

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
}

@InputType()
export class CreateDeployedTokenInput extends ImportTokenInput {
  name: string;

  symbol: string;

  isDeployed: boolean;
}
