import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { Platforms } from 'src/common/utils/constants';
import { ConnectWalletInput } from './wallet.input';

registerEnumType(Platforms, {
  name: 'Platforms',
  description: 'Platform names - app & portfolio',
});

@InputType()
export class AuthInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  redirectUri: string;
}

@InputType()
export class AuthEmailLoginInput extends AuthInput {
  @ApiProperty()
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @Field(() => Platforms, { defaultValue: Platforms.App })
  @IsOptional()
  platform?: Platforms;
}

@InputType()
export class AuthGoogleLoginInput extends AuthInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  code: string;
}

@InputType()
export class AuthValidationInput {
  @ApiProperty()
  @Field(() => String)
  @IsNotEmpty()
  code: string;
}

@InputType()
export class AuthAcceptInvitationInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  code: string;

  @ApiProperty()
  @IsOptional()
  wallet?: ConnectWalletInput;
}
