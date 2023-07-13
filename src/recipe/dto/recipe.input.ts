import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { RecipeStatus, Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateRecipeInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  vestingId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String)
  address?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  @Field(() => String)
  allocations: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Role)
  @Field(() => Role)
  role: Role;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  redirectUri: string;
}

@InputType()
export class BulkCreateRecipesInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => Array<CreateRecipeInput>)
  recipes: Array<CreateRecipeInput>;
}

@InputType()
export class RevokeRecipeInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;
}

@InputType()
export class ListRecipientsQueryInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String)
  vestingId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String)
  vestingContractId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String)
  tokenId?: string;

  @ApiProperty()
  @IsEnum(RecipeStatus)
  @IsOptional()
  @Field(() => RecipeStatus)
  status?: RecipeStatus;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  @Field(() => Number)
  chainId?: number;

  @ApiProperty()
  @IsEthereumAddress()
  @IsOptional()
  @Field(() => String)
  address?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @Field(() => String)
  email?: string;
}
