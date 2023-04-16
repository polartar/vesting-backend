import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateVestingContractInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => String)
  tokenId: string;

  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @Field(() => String)
  address?: string;

  @ApiProperty()
  @Field(() => String)
  transaction?: string;

  @ApiProperty()
  @Field(() => Number)
  chainId: number;
}
