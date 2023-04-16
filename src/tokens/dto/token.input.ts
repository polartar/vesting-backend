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
  chainId: number;

  @ApiProperty()
  @Field(() => String)
  @Optional()
  logo: string;
}
