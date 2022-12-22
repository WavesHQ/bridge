import { WhaleApiClient } from '@defichain/whale-api-client';
import { Injectable } from '@nestjs/common';

import { SupportedNetwork } from '../model/NetworkDto';
import { WhaleApiClientProvider } from '../providers/WhaleApiClientProvider';

@Injectable()
export class WhaleApiService {
  constructor(private readonly clientProvider: WhaleApiClientProvider) {}

  getClient(network: SupportedNetwork = SupportedNetwork.mainnet): WhaleApiClient {
    return this.clientProvider.getClient(network);
  }
}
