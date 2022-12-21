import { WhaleApiClient } from '@defichain/whale-api-client';
import { Injectable } from '@nestjs/common';

import { SupportedNetwork } from '../pipes/NetworkValidationPipe';
import { WhaleApiClientProvider } from '../providers/WhaleApiClientProvider';

@Injectable()
export class WhaleApiService {
  constructor(private readonly clientProvider: WhaleApiClientProvider) {}

  getClient(network: SupportedNetwork): WhaleApiClient {
    return this.clientProvider.getClient(network);
  }
}
