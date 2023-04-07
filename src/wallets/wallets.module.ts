import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Module({
  imports: [],
  controllers: [],
  providers: [WalletsService],
})
export class WalletsModule {}
