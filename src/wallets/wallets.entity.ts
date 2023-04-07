import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEthereumAddress } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';

@ObjectType()
export class WalletEntity extends CommonEntity implements Wallet {
  constructor(partial: Partial<WalletEntity>) {
    super();
    Object.assign(this, partial);
  }

  @Field(() => String)
  @ApiProperty()
  @Expose()
  userId: string;

  @Field(() => String)
  @ApiProperty()
  @Expose()
  @IsEthereumAddress()
  address: string;
}
