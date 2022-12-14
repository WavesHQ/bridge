import * as Joi from 'joi';

export function appConfig() {
  return {
    blockchain: {
      ethereumRpcUrl: process.env.ETHEREUM_RPC_URL || 'localhost:8545',
    },
  };
}

export const ENV_VALIDATION_SCHEMA = Joi.object({
  ETHEREUM_RPC_URL: Joi.string().ip(),
});
