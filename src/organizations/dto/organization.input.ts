import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { Permission, Role } from '@prisma/client';

import { Platforms } from 'src/common/utils/constants';

registerEnumType(Platforms, {
  name: 'Platforms',
  description: 'Platform names - app & portfolio',
});

registerEnumType(Permission, {
  name: 'Permissions',
  description: 'Permissions',
});

@InputType()
export class CreateOrganizationInput {
  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @Field(() => String)
  @IsEmail()
  email: string;
}

@InputType()
export class UpdateOrganizationInput {
  @ApiProperty()
  @Field(() => String)
  @IsOptional()
  name?: string;

  @ApiProperty()
  @Field(() => String)
  @IsEmail()
  @IsOptional()
  email?: string;
}

@InputType()
export class AddOrganizationVestingMemberInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => String)
  userId: string;

  @ApiProperty()
  @Field(() => Role)
  role: Role;
}

@InputType()
export class AddOrganizationPortfolioMemberInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => String)
  userId: string;

  @ApiProperty()
  @Field(() => Permission)
  permission: Permission;
}

@InputType()
export class AddOrganizationVestingMembersInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => AddOrganizationVestingMemberInput)
  members: Array<AddOrganizationVestingMemberInput>;
}

@InputType()
export class AddOrganizationPortfolioMembersInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => AddOrganizationPortfolioMemberInput)
  members: Array<AddOrganizationPortfolioMemberInput>;
}

@InputType()
export class InviteVestingMemberInput {
  @ApiProperty()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @Field(() => Role)
  role: Role;

  @ApiProperty()
  @Field(() => String)
  redirectUri: string;
}

@InputType()
export class InvitePortfolioMemberInput {
  @ApiProperty()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @Field(() => String)
  name: string;

  @ApiProperty()
  @Field(() => Permission)
  permission: Permission;

  @ApiProperty()
  @Field(() => String)
  redirectUri: string;
}

@InputType()
export class DeleteOrganizationMemberInput {
  @ApiProperty()
  @Field(() => String)
  userId: string;
}
