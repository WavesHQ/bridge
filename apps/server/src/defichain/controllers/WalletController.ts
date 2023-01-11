import { Controller, Get, Query } from '@nestjs/common';

import { NetworkDto } from '../model/NetworkDto';
import { WalletService } from '../services/WalletService';

@Controller('/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('generate-address')
  async get(@Query() query: NetworkDto): Promise<string> {
    return this.walletService.generateAddress(query.network);
  }
}
