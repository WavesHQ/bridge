/**
 * Place for common types we want to reuse in entire app
 */

export type Network = "Ethereum" | "DeFiChain";

export type NetworkEnvironment = "mainnet" | "testnet";

export interface TokenDetailI {
  name: string;
  symbol: string;
  icon: string;
  supply: string;
}

export enum SelectionType {
  Network = "Network",
  Token = "Token",
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