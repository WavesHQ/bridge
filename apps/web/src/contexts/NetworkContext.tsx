import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import { Network, NetworkOptionsI, TokensI } from "types";

interface NetworkContextI {
  selectedNetworkA: NetworkOptionsI;
  selectedTokensA: TokensI;
  selectedNetworkB: NetworkOptionsI;
  selectedTokensB: TokensI;
  setSelectedNetworkA: (networkA: NetworkOptionsI) => void;
  setSelectedTokensA: (tokenA: TokensI) => void;
}

export const networks = [
  {
    name: Network.Ethereum,
    icon: "/tokens/Ethereum.svg",
    tokens: [
      {
        tokenA: { name: "wBTC", icon: "/tokens/wBTC.svg", supply: "19255432" },
        tokenB: { name: "dBTC", icon: "/tokens/dBTC.svg", supply: "17625543" },
      },
      {
        tokenA: { name: "USDT", icon: "/tokens/USDT.svg", supply: "213123" },
        tokenB: { name: "dUSDT", icon: "/tokens/dUSDT.svg", supply: "130992" },
      },
      {
        tokenA: { name: "USDC", icon: "/tokens/USDC.svg", supply: "2310.4352" },
        tokenB: { name: "dUSDC", icon: "/tokens/dUSDC.svg", supply: "2818.21" },
      },
      {
        tokenA: { name: "ETH", icon: "/tokens/ETH.svg", supply: "523289.9012" },
        tokenB: { name: "dETH", icon: "/tokens/dETH.svg", supply: "131104.12" },
      },
    ],
  },
  {
    name: Network.DeFiChain,
    icon: "/tokens/DeFichain.svg",
    tokens: [
      {
        tokenA: { name: "dBTC", icon: "/tokens/dBTC.svg", supply: "17625543" },
        tokenB: { name: "wBTC", icon: "/tokens/wBTC.svg", supply: "19255432" },
      },
      {
        tokenA: { name: "dUSDT", icon: "/tokens/dUSDT.svg", supply: "130992" },
        tokenB: { name: "USDT", icon: "/tokens/USDT.svg", supply: "213123" },
      },
      {
        tokenA: { name: "dUSDC", icon: "/tokens/dUSDC.svg", supply: "2818.21" },
        tokenB: { name: "USDC", icon: "/tokens/USDC.svg", supply: "2310.4352" },
      },
      {
        tokenA: { name: "dETH", icon: "/tokens/dETH.svg", supply: "131104.12" },
        tokenB: { name: "ETH", icon: "/tokens/ETH.svg", supply: "523289.9012" },
      },
    ],
  },
];

const NetworkContext = createContext<NetworkContextI>(undefined as any);

export function useNetworkContext(): NetworkContextI {
  return useContext(NetworkContext);
}

export function NetworkProvider({
  children,
}: PropsWithChildren<{}>): JSX.Element | null {
  const [defaultNetworkA, defaultNetworkB] = networks;
  const [selectedNetworkA, setSelectedNetworkA] =
    useState<NetworkOptionsI>(defaultNetworkA);
  const [selectedTokensA, setSelectedTokensA] = useState<TokensI>(
    defaultNetworkA.tokens[0]
  );
  const [selectedNetworkB, setSelectedNetworkB] =
    useState<NetworkOptionsI>(defaultNetworkB);
  const [selectedTokensB, setSelectedTokensB] = useState<TokensI>(
    defaultNetworkB.tokens[0]
  );

  useEffect(() => {
    const networkB = networks.find(
      (network) => network.name !== selectedNetworkA.name
    );
    if (networkB !== undefined) {
      setSelectedNetworkB(networkB);
      const tokens = selectedNetworkA.tokens.find(
        (item) => item.tokenA.name === selectedTokensB.tokenA.name
      );
      if (tokens !== undefined) {
        setSelectedTokensA(tokens);
      }
    }
  }, [selectedNetworkA]);

  useEffect(() => {
    const tokens = selectedNetworkB.tokens.find(
      (item) => item.tokenA.name === selectedTokensA.tokenB.name
    );
    if (tokens !== undefined) {
      setSelectedTokensB(tokens);
    }
  }, [selectedTokensA]);

  const context: NetworkContextI = useMemo(
    () => ({
      selectedNetworkA,
      selectedTokensA,
      selectedNetworkB,
      selectedTokensB,
      setSelectedNetworkA,
      setSelectedTokensA,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTokensA, selectedTokensB]
  );

  return (
    <NetworkContext.Provider value={context}>
      {children}
    </NetworkContext.Provider>
  );
}
