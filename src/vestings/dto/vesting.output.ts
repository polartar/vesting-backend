import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class GetVestingQuery {
  @ApiProperty()
  @Field(() => Boolean)
  withOrganization: boolean;

  @ApiProperty()
  @Field(() => Boolean)
  withToken: boolean;
}
