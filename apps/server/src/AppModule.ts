import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig, ENV_VALIDATION_SCHEMA } from './AppConfig';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { EthersModule } from './modules/EthersModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: ENV_VALIDATION_SCHEMA,
    }),
    EthersModule,
  ],
  controllers: [AppController],
  providers: [AppService, EthersModule],
})
export class AppModule {}
