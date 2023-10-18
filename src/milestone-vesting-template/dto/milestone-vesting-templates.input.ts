import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Milestone } from 'src/milestone-vesting/dto/milestone-vesting.input';

@InputType()
export class CreateMilestoneVestingTemplateInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @IsArray()
  @Field(() => Array)
  milestones: Array<Milestone>;
}
