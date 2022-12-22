import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  PropsWithChildren,
} from "react";
import { NetworkEnvironment } from "types";

const DEFAULT_ENV_NETWORK = NetworkEnvironment.mainnet;
const NETWORK_ENV_DISPLAY_NAME: Record<NetworkEnvironment, string> = {
  mainnet: "MainNet",
  testnet: "TestNet",
  regtest: "Local",
};

interface NetworkContextI {
  networkEnv: NetworkEnvironment;
  networkEnvDisplayName: string;
  updateNetworkEnv: (networkEnv: NetworkEnvironment) => void;
  resetNetworkEnv: () => void;
}

const NetworkEnvironmentContext = createContext<NetworkContextI>(
  undefined as any
);

export function useNetworkEnvironmentContext(): NetworkContextI {
  return useContext(NetworkEnvironmentContext);
}

export function NetworkEnvironmentProvider({
  children,
}: PropsWithChildren<{}>): JSX.Element | null {
  const [networkEnv, setNetworkEnv] =
    useState<NetworkEnvironment>(DEFAULT_ENV_NETWORK);
  const [networkEnvDisplayName, setNetworkEnvDisplayName] = useState<string>(
    NETWORK_ENV_DISPLAY_NAME[DEFAULT_ENV_NETWORK]
  );

  const handleNetworkEnvChange = (value: NetworkEnvironment) => {
    setNetworkEnv(value);
    setNetworkEnvDisplayName(NETWORK_ENV_DISPLAY_NAME[value]);
  };

  const resetNetworkEnv = () => {
    handleNetworkEnvChange(DEFAULT_ENV_NETWORK);
  };

  const context: NetworkContextI = useMemo(
    () => ({
      networkEnv,
      networkEnvDisplayName,
      updateNetworkEnv: handleNetworkEnvChange,
      resetNetworkEnv,
    }),
    [networkEnv]
  );

  return (
    <NetworkEnvironmentContext.Provider value={context}>
      {children}
    </NetworkEnvironmentContext.Provider>
  );
}
