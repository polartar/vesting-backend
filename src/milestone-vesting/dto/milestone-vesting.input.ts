import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  CliffDurationType,
  ReleaseFrequencyType,
  Role,
  VestingStatus,
  MilestoneVestingType,
} from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

registerEnumType(VestingStatus, {
  name: 'VestingStatus',
  description: 'VestingStatus',
});

@InputType()
export class Milestone {
  @ApiProperty()
  @IsEthereumAddress()
  @IsNumberString()
  @IsNotEmpty()
  @Field(() => String)
  allocation: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Field(() => String)
  description: string;

  @ApiProperty()
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  title: string;

  @ApiProperty()
  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  duration: string;

  @ApiProperty()
  @IsEnum(ReleaseFrequencyType)
  @IsNotEmpty()
  @Field(() => ReleaseFrequencyType)
  releaseFreq: ReleaseFrequencyType;
}

@InputType()
export class CreateMilestoneVestingInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  vestingContractId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Field(() => String)
  transactionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  templateName: string;

  @ApiProperty()
  @IsEnum(MilestoneVestingType)
  @IsNotEmpty()
  @Field(() => MilestoneVestingType)
  type: MilestoneVestingType;

  @ApiProperty()
  @IsArray()
  @Field(() => Array)
  milestones: Array<Milestone>;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  recipientName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  recipientEmail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  recipientWalletAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  redirectUri: string;

  @ApiProperty()
  @IsEnum(VestingStatus)
  @IsNotEmpty()
  @Field(() => VestingStatus)
  status: VestingStatus;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  allocation: string;
}
