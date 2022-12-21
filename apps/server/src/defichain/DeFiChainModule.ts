import { Module } from '@nestjs/common';

import { StatsController } from './controllers/StatsController';
import { WhaleApiClientProvider } from './providers/WhaleApiClientProvider';
import { WhaleApiService } from './services/WhaleApiService';

@Module({
  providers: [WhaleApiClientProvider, WhaleApiService],
  controllers: [StatsController],
  exports: [],
})
export class DeFiChainModule {}
