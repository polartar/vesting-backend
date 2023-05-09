import { IsEmail, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class AuthInput {
  @ApiProperty()
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

@InputType()
export class AuthGoogleCallbackInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  redirectUri: string;
}

@InputType()
export class AuthGoogleLoginInput extends AuthGoogleCallbackInput {
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
