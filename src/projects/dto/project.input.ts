import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEthereumAddress,
  IsBoolean,
  IsArray,
} from 'class-validator';

@InputType()
export class CreateProjectInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEthereumAddress()
  @Field(() => String)
  contract?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEthereumAddress()
  @Field(() => String)
  wallet?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Field(() => Number)
  chainId?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  website?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => Date)
  tgeDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean)
  isLive: boolean;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @Field(() => Array)
  entityIds: string[];
}

@InputType()
export class QueryProjectInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Field(() => Number)
  chainId?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean)
  onlyLive?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String)
  wallet?: string;

  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String)
  contract?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  entityId?: string;
}
