import { CodexNestJsonRpcApp } from '@cec-org/codex-nestjs-jsonrpc';

import { AppModule } from './AppModule';

class BridgeServerApp extends CodexNestJsonRpcApp {
  override provideRootModule(): typeof AppModule {
    return AppModule;
  }
}

if (require.main === module) {
  void new BridgeServerApp().start();
}
