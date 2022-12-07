import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

export const ETHERS_RPC_PROVIDER = 'ETHERS_RPC_PROVIDER';

@Module({
  providers: [
    {
      provide: ETHERS_RPC_PROVIDER,
      useFactory: (configService: ConfigService) =>
        new ethers.providers.StaticJsonRpcProvider(configService.getOrThrow('blockchain.ethereumRpcUrl')),
      inject: [ConfigService],
    },
  ],
  exports: [ETHERS_RPC_PROVIDER],
})
export class EthersModule {}
