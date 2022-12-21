import { JellyfishJSON } from '@defichain/jellyfish-json';
import helmet from '@fastify/helmet';
import { NestApplicationOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';

import { BaseModule } from './modules/BaseModule';

/**
 * App which starts the default Bridge Server Application with production-ready configs
 */
export class BridgeServerApp<App extends NestFastifyApplication = NestFastifyApplication> {
  protected app?: App;

  constructor(protected readonly module: any) {}

  get nestApplicationOptions(): NestApplicationOptions {
    return {
      bufferLogs: true,
    };
  }

  get fastifyAdapter(): FastifyAdapter {
    const adapter = new FastifyAdapter();
    this.setupJellyfishJSON(adapter);
    return adapter;
  }

  setupJellyfishJSON(adapter: FastifyAdapter): void {
    adapter.getInstance().setReplySerializer((payload) => JellyfishJSON.stringify(payload));
  }

  async createNestApp(): Promise<App> {
    const module = BaseModule.with({ imports: [this.module] });
    const app = await NestFactory.create<App>(module, this.fastifyAdapter, this.nestApplicationOptions);
    await this.configureApp(app);
    return app;
  }

  async configureApp(app: NestFastifyApplication): Promise<void> {
    app.useLogger(app.get(Logger));
    app.enableCors({
      origin: '*',
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type'],
      maxAge: 60 * 24 * 7,
    });
    await app.register(helmet);
  }

  /**
   * Run any additional initialisation steps before starting the server.
   * If there are additional steps, can be overriden by any extending classes
   */
  async init(): Promise<App> {
    this.app = await this.createNestApp();
    return this.app.init();
  }

  /**
   * Start listening on APP_PORT with APP_HOSTNAME, the default being 0.0.0.0:5741
   */
  async start(): Promise<App> {
    const app = await this.init();

    const config = app.get(ConfigService);
    const port = config.get<number>('APP_PORT', 5741);
    const hostname = config.get<string>('APP_HOSTNAME', '0.0.0.0');
    await app.listen(port, hostname);

    return app;
  }

  /**
   * Stop NestJs and un-assign this.app
   */
  async stop(): Promise<void> {
    await this.app?.close();
    this.app = undefined;
  }
}
