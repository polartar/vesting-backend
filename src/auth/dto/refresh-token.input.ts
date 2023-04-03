import { ArgsType, Field } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty } from 'class-validator';
import { GraphQLJWT } from 'graphql-scalars';
import { ApiProperty } from '@nestjs/swagger';

@ArgsType()
export class RefreshTokenInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  @Field(() => GraphQLJWT)
  token: string;
}
