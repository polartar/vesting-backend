import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

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
export class AddOrganizationMemberInput {
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
export class AddOrganizationMembersInput {
  @ApiProperty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @Field(() => AddOrganizationMemberInput)
  members: Array<AddOrganizationMemberInput>;
}

@InputType()
export class InviteMemberInput {
  @ApiProperty()
  @Field(() => String)
  email: string;

  @ApiProperty()
  @Field(() => Role)
  role: Role;

  @ApiProperty()
  @Field(() => String)
  redirectUri: string;
}
