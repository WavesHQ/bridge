import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { appConfig, ENV_VALIDATION_SCHEMA } from './AppConfig';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { DeFiChainModule } from './defichain/DeFiChainModule';
import { EthersModule } from './modules/EthersModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: ENV_VALIDATION_SCHEMA,
    }),
    EthersModule,
    DeFiChainModule,
    RouterModule.register([
      {
        path: 'defichain',
        module: DeFiChainModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, DeFiChainModule],
})
export class AppModule {}
