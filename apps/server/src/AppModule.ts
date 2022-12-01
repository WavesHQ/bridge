import { ActuatorModule, ActuatorProbes } from '@cec-org/codex-nestjs-actuator';
import { Global, Module } from '@nestjs/common';

import { AppController } from './AppController';
import { AppProbeIndicator } from './AppProbeIndicator';
import { AppService } from './AppService';

@Global()
@Module({
  providers: [AppProbeIndicator, AppService],
  imports: [ActuatorModule],
  exports: [],
  controllers: [AppController],
})
export class AppModule {
  constructor(private readonly probes: ActuatorProbes, private readonly appProbeIndicator: AppProbeIndicator) {}

  async onApplicationBootstrap(): Promise<void> {
    this.probes.add(this.appProbeIndicator);
  }
}
