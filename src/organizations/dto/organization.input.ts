import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class CreateOrganizationInput {
  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @Field(() => String)
  @IsEmail()
  email: string;
}

@InputType()
export class UpdateOrganizationInput {
  @ApiProperty()
  @Field(() => String)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @Field(() => String)
  @IsEmail()
  @IsOptional()
  email?: string;
}
