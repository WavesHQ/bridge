/**
 * Place for common types we want to reuse in entire app
 */

export enum Network {
  Ethereum = "Ethereum",
  DeFiChain = "DeFiChain",
}

export enum NetworkAddressToken {
  Ethereum = "ERC20",
  DeFiChain = "DeFiChain",
}

export enum NetworkEnvironment {
  mainnet = "mainnet",
  testnet = "testnet",
  local = "regtest",
}

export interface TokenDetailI {
  name: string;
  symbol: string;
  icon: string;
  supply: string;
}

export enum SelectionType {
  "Network" = "Network",
  "Token" = "Token",
}

export interface TokensI {
  tokenA: TokenDetailI;
  tokenB: TokenDetailI;
}
export interface NetworkOptionsI {
  name: string;
  icon: string;
  tokens: TokensI[];
}
