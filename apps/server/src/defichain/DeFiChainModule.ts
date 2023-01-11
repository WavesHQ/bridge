import { Module } from '@nestjs/common';

import { StatsController } from './controllers/StatsController';
import { WalletController } from './controllers/WalletController';
import { WhaleApiClientProvider } from './providers/WhaleApiClientProvider';
import { WalletService } from './services/WalletService';
import { WhaleApiService } from './services/WhaleApiService';

@Module({
  providers: [WhaleApiClientProvider, WhaleApiService, WalletService],
  controllers: [StatsController, WalletController],
  exports: [],
})
export class DeFiChainModule {}
