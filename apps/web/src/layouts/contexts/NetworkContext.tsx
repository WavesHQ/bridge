import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import { Network, NetworkOptionsI, TokensI, UnconfirmedTxnI } from "types";
import { getLocalStorage } from "@utils/localStorage";
import { useNetworkEnvironmentContext } from "./NetworkEnvironmentContext";
import { LOCAL_STORAGE_TXN_KEY } from "../../constants";

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
        tokenA: {
          name: "wBTC",
          symbol: "BTC",
          icon: "/tokens/wBTC.svg",
          supply: "1925543.1234",
        },
        tokenB: {
          name: "dBTC",
          symbol: "BTC",
          icon: "/tokens/dBTC.svg",
          supply: "1925543.1234",
        },
      },
      {
        tokenA: {
          name: "USDT",
          symbol: "USDT",
          icon: "/tokens/USDT.svg",
          supply: "6503681021.125",
        },
        tokenB: {
          name: "dUSDT",
          symbol: "USDT",
          icon: "/tokens/dUSDT.svg",
          supply: "6503681021.125",
        },
      },
      {
        tokenA: {
          name: "USDC",
          symbol: "USDC",
          icon: "/tokens/USDC.svg",
          supply: "43666178314.768",
        },
        tokenB: {
          name: "dUSDC",
          symbol: "USDC",
          icon: "/tokens/dUSDC.svg",
          supply: "43666178314.768",
        },
      },
      {
        tokenA: {
          name: "ETH",
          symbol: "ETH",
          icon: "/tokens/ETH.svg",
          supply: "120052901.9012",
        },
        tokenB: {
          name: "dETH",
          symbol: "ETH",
          icon: "/tokens/dETH.svg",
          supply: "120052901.9012",
        },
      },
    ],
  },
  {
    name: Network.DeFiChain,
    icon: "/tokens/DeFichain.svg",
    tokens: [
      {
        tokenA: {
          name: "dBTC",
          symbol: "BTC",
          icon: "/tokens/dBTC.svg",
          supply: "1801245.4321",
        },
        tokenB: {
          name: "wBTC",
          symbol: "BTC",
          icon: "/tokens/wBTC.svg",
          supply: "1801245.4321",
        },
      },
      {
        tokenA: {
          name: "dUSDT",
          symbol: "USDT",
          icon: "/tokens/dUSDT.svg",
          supply: "5903681123.781",
        },
        tokenB: {
          name: "USDT",
          symbol: "USDT",
          icon: "/tokens/USDT.svg",
          supply: "5903681123.781",
        },
      },
      {
        tokenA: {
          name: "dUSDC",
          symbol: "USDC",
          icon: "/tokens/dUSDC.svg",
          supply: "33777178314.091",
        },
        tokenB: {
          name: "USDC",
          symbol: "USDC",
          icon: "/tokens/USDC.svg",
          supply: "33777178314.091",
        },
      },
      {
        tokenA: {
          name: "dETH",
          symbol: "ETH",
          icon: "/tokens/dETH.svg",
          supply: "107732901.8210",
        },
        tokenB: {
          name: "ETH",
          symbol: "ETH",
          icon: "/tokens/ETH.svg",
          supply: "107732901.8210",
        },
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
  const { updateNetworkEnv } = useNetworkEnvironmentContext();

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

  useEffect(() => {
    const localData = getLocalStorage<UnconfirmedTxnI>(LOCAL_STORAGE_TXN_KEY);
    if (localData) {
      setSelectedNetworkA(localData.selectedNetworkA);
      setSelectedTokensA(localData.selectedTokensA);
      setSelectedNetworkB(localData.selectedNetworkB);
      setSelectedTokensB(localData.selectedTokensB);
      updateNetworkEnv(localData.networkEnv);
    }
  }, []);

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
