import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

import { User } from './user.model';
import { BaseModel } from 'src/common/models/base.model';
import { Organization } from 'src/organizations/models/organizations.model';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class UserRole extends BaseModel {
  @Field(() => String)
  userId: string;

  @Field(() => User)
  User: User;

  @Field(() => String)
  organizationId: string;

  @Field(() => Organization)
  Organization: Organization;

  @Field(() => Role)
  role: Role;
}
