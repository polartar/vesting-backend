import { IsEmail, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class AuthInput {
  @ApiProperty()
  @Field(() => String)
  @IsEmail()
  email: string;
}

@InputType()
export class AuthGoogleLoginInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  code: string;
}

@InputType()
export class AuthValidationInput extends AuthInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  code: string;
}
