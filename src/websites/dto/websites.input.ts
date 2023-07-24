import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateWebsiteInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Field(() => Array)
  domains: string[];

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @Field(() => Object)
  features: any;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @Field(() => Object)
  assets: any;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @Field(() => Object)
  links: any;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @Field(() => Object)
  styles: any;
}
