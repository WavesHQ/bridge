import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppService } from './AppService';

@Controller('app')
export class AppController {
  constructor(readonly config: ConfigService, private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
