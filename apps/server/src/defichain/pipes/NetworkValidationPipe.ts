import { HttpException, Injectable, PipeTransform } from '@nestjs/common';

export type SupportedNetwork = 'mainnet' | 'testnet' | 'regtest' | 'local';

@Injectable()
export class NetworkValidationPipe implements PipeTransform {
  private static readonly VALID_NETWORKS: Set<undefined | SupportedNetwork> = new Set([
    undefined, // defaults to 'mainnet'
    'local',
    'mainnet',
    'testnet',
    'regtest',
  ]);

  transform(value: any): any {
    if (NetworkValidationPipe.VALID_NETWORKS.has(value)) {
      return value;
    }
    throw new InvalidNetworkException();
  }
}

export class InvalidNetworkException extends HttpException {
  constructor() {
    super(
      {
        statusCode: 404,
        message: 'Invalid network',
      },
      404,
    );
  }
}
