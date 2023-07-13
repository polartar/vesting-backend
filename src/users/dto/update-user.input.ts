import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEthereumAddress,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field()
  name: string;
}

@InputType()
export class QueryUserInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  id?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  @Field(() => String)
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsEthereumAddress()
  @Field(() => String)
  address?: string;
}
