import { WhaleApiClient } from '@defichain/whale-api-client';
import { Injectable } from '@nestjs/common';
import { EnvironmentNetwork, newOceanOptions, newWhaleAPIClient } from '@waveshq/walletkit-core';

import { SupportedNetwork } from '../pipes/NetworkValidationPipe';

@Injectable()
export class WhaleApiClientProvider {
  private readonly clientCacheByNetwork: Map<SupportedNetwork, WhaleApiClient> = new Map();

  /**
   * Lazily initialises WhaleApiClients and caches them by network for performance.
   * @param network - the network to connect to
   */
  getClient(network: SupportedNetwork): WhaleApiClient {
    const client = this.clientCacheByNetwork.get(network);
    if (client !== undefined) {
      return client;
    }
    return this.createAndCacheClient(network);
  }

  remapNetwork(network: SupportedNetwork): EnvironmentNetwork {
    switch (network) {
      case 'mainnet':
        return EnvironmentNetwork.MainNet;
      case 'testnet':
        return EnvironmentNetwork.TestNet;
      case 'regtest':
        return EnvironmentNetwork.RemotePlayground;
      case 'local':
      default:
        return EnvironmentNetwork.LocalPlayground;
    }
  }

  private createAndCacheClient(network: SupportedNetwork): WhaleApiClient {
    const client = newWhaleAPIClient(newOceanOptions(this.remapNetwork(network)));
    this.clientCacheByNetwork.set(network, client);
    return client;
  }
}
