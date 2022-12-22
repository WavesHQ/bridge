import { stats } from '@defichain/whale-api-client';
import { Controller, Get, Query } from '@nestjs/common';

import { NetworkDto } from '../model/NetworkDto';
import { WhaleApiService } from '../services/WhaleApiService';

@Controller('/stats')
export class StatsController {
  constructor(private readonly whaleClient: WhaleApiService) {}

  @Get()
  async get(@Query() query: NetworkDto): Promise<stats.StatsData> {
    return this.whaleClient.getClient(query.network).stats.get();
  }
}
