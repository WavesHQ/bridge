import {
  generateMnemonicWords,
  MnemonicHdNodeProvider,
  MnemonicProviderData,
} from '@defichain/jellyfish-wallet-mnemonic';
import { EnvironmentNetwork, getBip32Option } from '@waveshq/walletkit-core';
import * as randombytes from 'randombytes';

export enum WalletType {
  MNEMONIC_UNPROTECTED = 'MNEMONIC_UNPROTECTED',
  MNEMONIC_ENCRYPTED = 'MNEMONIC_ENCRYPTED',
}

export interface WalletPersistenceDataI<T> {
  type: WalletType;
  /* To migrate between app version upgrade */
  version: 'v1';
  /* Raw Data encoded in WalletType specified format */
  raw: T;
}

function initProvider(
  data: WalletPersistenceDataI<MnemonicProviderData>,
  network: EnvironmentNetwork,
): MnemonicHdNodeProvider {
  if (data.type !== WalletType.MNEMONIC_UNPROTECTED || data.version !== 'v1') {
    throw new Error('Unexpected WalletPersistenceDataI');
  }

  const options = getBip32Option(network);
  return MnemonicHdNodeProvider.fromData(data.raw, options);
}

function toData(mnemonic: string[], network: EnvironmentNetwork): WalletPersistenceDataI<MnemonicProviderData> {
  const options = getBip32Option(network);
  const data = MnemonicHdNodeProvider.wordsToData(mnemonic, options);

  return {
    version: 'v1',
    type: WalletType.MNEMONIC_UNPROTECTED,
    raw: data,
  };
}

function generateWords(): string[] {
  return generateMnemonicWords(24, (numOfBytes) => {
    const bytes = randombytes(numOfBytes);
    return Buffer.from(bytes);
  });
}

export const MnemonicUnprotected = {
  initProvider,
  toData,
  generateWords,
};
