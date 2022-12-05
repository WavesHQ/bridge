import clsx from "clsx";
import { useNetworkEnvironmentContext } from "@contexts/NetworkEnvironmentContext";

export default function EnvironmentNetworkSwitch(): JSX.Element {
  const { networkEnv, updateNetworkEnv } = useNetworkEnvironmentContext();

  const handleOnClick = () => {
    const newNetwork = networkEnv === "mainnet" ? "testnet" : "mainnet";
    updateNetworkEnv(newNetwork);
  };

  return (
    <button
      type="button"
      className="flex items-center rounded-[37px] dark-section-bg border border-dark-card-stroke px-2 py-1 lg:px-3 lg:py-2 ml-2 hover:dark-btn-hover hover:border-dark-500"
      onClick={handleOnClick}
    >
      <div
        className={clsx(
          "w-2 h-2 rounded-full mr-1",
          networkEnv === "mainnet" ? "bg-valid" : "bg-warning"
        )}
      />
      <span className="text-dark-1000 text-2xs font-bold tracking-widest uppercase">
        {networkEnv}
      </span>
    </button>
  );
}
