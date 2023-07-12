import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ConnectWalletInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  signature: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  @Field(() => String)
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  utcTime: UTCString;
}
