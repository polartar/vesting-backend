import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateEntityInput {
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
}

@InputType()
export class QueryEntityInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  organizationId?: string;
}
