import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CliffDurationType, ReleaseFrequencyType, Role } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateVestingRecipeInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String)
  name?: string;

  @ApiProperty()
  @IsEthereumAddress()
  @IsOptional()
  @Field(() => String)
  address?: string;

  @ApiProperty()
  @IsEthereumAddress()
  @IsNumberString()
  @IsNotEmpty()
  @Field(() => String)
  allocations: string;

  @ApiProperty()
  @IsEnum(Role)
  @IsNotEmpty()
  @Field(() => Role)
  role: Role;
}

@InputType()
export class CreateVestingDetailInput {
  @ApiProperty()
  @IsString()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsString()
  @Field(() => String)
  vestingContractId: string;

  @ApiProperty()
  @IsString()
  @Field(() => String)
  tokenId: string;

  @ApiProperty()
  @IsString()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @IsString()
  @Field(() => Date)
  startedAt: Date;

  @ApiProperty()
  @IsString()
  @Field(() => Date)
  endedAt: Date;

  @ApiProperty()
  @IsString()
  @Field(() => Date)
  originalEndedAt: Date;

  @ApiProperty()
  @IsEnum(ReleaseFrequencyType)
  @Field(() => ReleaseFrequencyType)
  releaseFrequencyType: ReleaseFrequencyType;

  @ApiProperty()
  @IsNumber()
  @Field(() => Number)
  releaseFrequency: number;

  @ApiProperty()
  @IsEnum(CliffDurationType)
  @Field(() => CliffDurationType)
  cliffDurationType: CliffDurationType;

  @ApiProperty()
  @IsNumber()
  @Field(() => Number)
  cliffDuration: number;

  @ApiProperty()
  @IsNumberString()
  @Field(() => String)
  cliffAmount: string;

  @ApiProperty()
  @IsNumberString()
  @Field(() => String)
  amount: string;
}

@InputType()
export class CreateVestingInput extends CreateVestingDetailInput {
  @ApiProperty()
  @IsArray()
  @Field(() => Array)
  recipes: Array<CreateVestingRecipeInput>;

  @ApiProperty()
  @IsString()
  @Field(() => String)
  redirectUri: string;
}
