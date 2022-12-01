import { ProbeIndicator } from '@cec-org/codex-nestjs-actuator';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class AppProbeIndicator extends ProbeIndicator {
  async liveness(): Promise<HealthIndicatorResult> {
    // TODO: Logic to check if app is live
    return this.withAlive('example', 'live');
  }

  async readiness(): Promise<HealthIndicatorResult> {
    // TODO: Logic to check if app is ready for connections
    return this.withAlive('example', 'ready');
  }
}
