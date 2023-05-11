import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { CliffDurationType, ReleaseFrequencyType } from '@prisma/client';

@InputType()
export class CreateVestingTemplateInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @Field(() => ReleaseFrequencyType)
  releaseFrequencyType: ReleaseFrequencyType;

  @ApiProperty()
  @Field(() => Number)
  releaseFrequency: number;

  @ApiProperty()
  @Field(() => CliffDurationType)
  cliffDurationType: CliffDurationType;

  @ApiProperty()
  @Field(() => Number)
  cliffDuration: number;

  @ApiProperty()
  @Field(() => Number)
  cliffAmount: number;
}
