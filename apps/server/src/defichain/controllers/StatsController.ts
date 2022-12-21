import { StatsData } from '@defichain/whale-api-client/dist/api/stats';
import { Controller, Get, Query } from '@nestjs/common';

import { NetworkValidationPipe, SupportedNetwork } from '../pipes/NetworkValidationPipe';
import { WhaleApiService } from '../services/WhaleApiService';

@Controller('/stats')
export class StatsController {
  constructor(private readonly whaleClient: WhaleApiService) {}

  @Get()
  async get(@Query('network', NetworkValidationPipe) network: SupportedNetwork = 'mainnet'): Promise<StatsData> {
    return this.whaleClient.getClient(network).stats.get();
  }
}
