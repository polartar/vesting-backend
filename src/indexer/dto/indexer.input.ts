import { InputType } from '@nestjs/graphql';
import { VestingStatus } from '@prisma/client';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionEvents } from './interfaces';

@InputType()
export class UpdateTransactionInput {
  @IsNotEmpty()
  @IsString()
  hash: string;

  @IsNotEmpty()
  @IsNumber()
  chainId: number;

  @IsOptional()
  @IsEthereumAddress()
  address?: string;

  @IsNotEmpty()
  @IsEnum(TransactionEvents)
  event: TransactionEvents;
}

@InputType()
export class UpdateVestingContractBalanceInput {
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;

  @IsNotEmpty()
  @IsNumberString()
  amount: string;
}
