import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateMembershipInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  organizationId: string;
}
