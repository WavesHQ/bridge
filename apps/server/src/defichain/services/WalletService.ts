import { JellyfishWallet, WalletHdNode, WalletHdNodeProvider } from '@defichain/jellyfish-wallet';
import { WhaleApiClient } from '@defichain/whale-api-client';
import { WhaleWalletAccount, WhaleWalletAccountProvider } from '@defichain/whale-api-wallet';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EnvironmentNetwork, getJellyfishNetwork } from '@waveshq/walletkit-core';

import { SupportedNetwork } from '../model/NetworkDto';
import { MnemonicEncrypted } from '../providers/MnemonicEncryptedProvider';
import { MnemonicUnprotected } from '../providers/MnemonicUnprotectedProvider';
import { WhaleApiService } from './WhaleApiService';

@Injectable()
export class WalletService {
  constructor(private readonly whaleClient: WhaleApiService) {}

  async generateAddress(network: SupportedNetwork = SupportedNetwork.mainnet): Promise<string> {
    const words = MnemonicUnprotected.generateWords();
    /* TODO: Replace with EncryptedProviderData of member here once available */
    const encrypted = await MnemonicEncrypted.toData(words, mapNetwork(network), '000000');
    const provider = MnemonicEncrypted.initProvider(encrypted, mapNetwork(network), {
      async prompt() {
        throw new Error('Nothing attached for passphrase prompting');
      },
    });

    const whaleApiClient = this.whaleClient.getClient(network);
    const account = initJellyfishWallet(provider, mapNetwork(network), whaleApiClient).get(1);
    const address = await account.getAddress().catch((error: Error) => {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There is a problem in generating an address',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    });

    return address;
  }
}

function initJellyfishWallet<HdNode extends WalletHdNode>(
  provider: WalletHdNodeProvider<HdNode>,
  network: EnvironmentNetwork,
  client: WhaleApiClient,
): JellyfishWallet<WhaleWalletAccount, HdNode> {
  const accountProvider = new WhaleWalletAccountProvider(client, getJellyfishNetwork(network));
  return new JellyfishWallet(provider, accountProvider);
}

function mapNetwork(network: SupportedNetwork | undefined): EnvironmentNetwork {
  switch (network) {
    case SupportedNetwork.local:
      return EnvironmentNetwork.LocalPlayground;
    case SupportedNetwork.mainnet:
      return EnvironmentNetwork.MainNet;
    case SupportedNetwork.regtest:
      return EnvironmentNetwork.RemotePlayground;
    case SupportedNetwork.testnet:
      return EnvironmentNetwork.TestNet;
    default:
      return EnvironmentNetwork.LocalPlayground;
  }
}
