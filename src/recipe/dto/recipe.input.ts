import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateRecipeInput {
  @ApiProperty()
  @Field(() => String)
  vestingId: string;

  @ApiProperty()
  @Field(() => String)
  recipientId: string;

  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => String)
  allocations: string;
}

@InputType()
export class BulkCreateRecipesInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => Array<CreateRecipeInput>)
  recipes: Array<CreateRecipeInput>;
}
