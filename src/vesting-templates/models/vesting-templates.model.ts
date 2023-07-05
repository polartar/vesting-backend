import 'reflect-metadata';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Organization } from 'src/organizations/models/organizations.model';
import { ReleaseFrequencyType, CliffDurationType } from '@prisma/client';

registerEnumType(ReleaseFrequencyType, {
  name: 'ReleaseFrequencyType',
  description: 'Release frequency types',
});

registerEnumType(CliffDurationType, {
  name: 'CliffDurationType',
  description: 'Cliff duration types',
});

@ObjectType()
export class Vesting extends BaseModel {
  @Field(() => String)
  organizationId: string;

  @Field(() => Organization)
  organization: Organization;

  @Field(() => ReleaseFrequencyType, { defaultValue: 'CONTINUOUS' })
  releaseFrequencyType: ReleaseFrequencyType;

  @Field(() => Number)
  releaseFrequency: number;

  @Field(() => CliffDurationType, { defaultValue: 'NO_CLIFF' })
  cliffDurationType: CliffDurationType;

  @Field(() => Number, { defaultValue: 0 })
  cliffDuration: number;

  @Field(() => String, { defaultValue: '0' })
  cliffAmount: string;
}
