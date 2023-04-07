import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress } from 'class-validator';

@InputType()
export class ConnectWalletInput {
  @ApiProperty()
  @Field(() => String)
  signature: string;

  @ApiProperty()
  @Field(() => String)
  @IsEthereumAddress()
  address: string;

  @ApiProperty()
  @Field(() => String)
  utcTime: UTCString;
}
