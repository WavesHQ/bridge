import { shift, autoUpdate, size, useFloating } from "@floating-ui/react-dom";
import { networks, useNetworkContext } from "@contexts/NetworkContext";
import { Network, SelectionType, TokensI, NetworkOptionsI } from "types";
import { InputSelector } from "./InputSelector";
import { SwitchIcon } from "./icons/SwitchIcon";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";
import NumericFormat from "./commons/NumericFormat";
import WalletAddressInput from "./WalletAddressInput";
import DailyLimit from "./DailyLimit";
import IconTooltip from "./commons/IconTooltip";

export default function BridgeForm() {
  const {
    selectedNetworkA,
    selectedTokensA,
    selectedNetworkB,
    selectedTokensB,
    setSelectedNetworkA,
    setSelectedTokensA,
  } = useNetworkContext();

  const switchNetwork = () => {
    setSelectedNetworkA(selectedNetworkB);
  };

  const { y, reference, floating, strategy, refs } = useFloating({
    placement: "bottom-end",
    middleware: [
      shift(),
      size({
        apply({ rects }) {
          if (
            refs.floating.current !== null &&
            refs.floating.current !== undefined
          ) {
            Object.assign(refs.floating.current.style, {
              minWidth: "225px",
              maxWidth: "368px",
              width: `${rects.reference.width}px`,
            });
          }
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const floatingObj = {
    strategy,
    y,
    floating,
  };

  return (
    <div className="w-full md:w-[calc(100%+2px)] lg:w-full dark-card-bg-image p-6 md:pt-8 pb-16 lg:p-12 rounded-lg lg:rounded-xl border border-dark-200 backdrop-blur-[18px]">
      <div className="flex flex-row items-center" ref={reference}>
        <div className="w-1/2">
          <InputSelector
            label="Source Network"
            popUpLabel="Select source"
            options={networks}
            floatingObj={floatingObj}
            type={SelectionType.Network}
            onSelect={(value: NetworkOptionsI) => setSelectedNetworkA(value)}
            value={selectedNetworkA}
          />
        </div>
        <div className="w-1/2">
          <InputSelector
            label="Token"
            popUpLabel="Select token"
            options={selectedNetworkA.tokens}
            floatingObj={floatingObj}
            type={SelectionType.Token}
            onSelect={(value: TokensI) => setSelectedTokensA(value)}
            value={selectedTokensA}
          />
        </div>
      </div>
      <SwitchButton onClick={switchNetwork} />

      <div className="flex flex-row items-end mb-4 lg:mb-5">
        <div className="w-1/2">
          <InputSelector
            label="Destination Network"
            disabled
            popUpLabel="Select destination"
            floatingObj={floatingObj}
            type={SelectionType.Network}
            value={selectedNetworkB}
          />
        </div>
        <div className="w-1/2">
          <InputSelector
            disabled
            label="Token to Receive"
            popUpLabel="Select token"
            floatingObj={floatingObj}
            type={SelectionType.Token}
            value={selectedTokensB}
          />
        </div>
      </div>
      <div className="mb-8">
        <WalletAddressInput
          label="Address"
          blockchain={selectedNetworkB.name as Network}
          /* TODO: disabled should be based on whether wallet is connected or not */
          disabled={false}
        />
      </div>
      <div className="flex flex-row justify-between items-center px-5">
        <div className="flex flex-row items-center">
          <span className="text-dark-700 text-xs lg:text-base font-semibold md:font-normal">
            Fees
          </span>
          <div className="ml-2">
            <IconTooltip
              title="Fees"
              content="Fees to cover the cost of transactions on DeFiChain and Ethereum networks. For more information, visit our user guide."
            />
          </div>
        </div>
        <NumericFormat
          className="text-dark-1000 text-left text-xs lg:text-base"
          value={0}
          decimalScale={2}
          thousandSeparator
          suffix={` ${selectedTokensA.tokenA.name}`}
        />
      </div>
      <div className="block md:hidden px-5 mt-4">
        <DailyLimit />
      </div>
      <div className="mt-8 px-6 md:mt-6 md:px-4 lg:mt-16 lg:mb-0 lg:px-[88px]">
        <button
          type="button"
          className="bg-dark-1000 text-dark-00 w-full rounded-[92px] p-3.5 text-lg font-bold md:p-2.5 lg:p-4 lg:text-xl"
        >
          Connect wallet
        </button>
      </div>
    </div>
  );
}

function SwitchButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="my-8 flex flex-row">
      <div className="border-dark-300 mt-6 flex w-full flex-1 justify-between border-t border-opacity-50" />
      <button
        type="button"
        onClick={onClick}
        className="dark-card-bg dark-bg-card-section group flex h-12 w-12 items-center justify-center rounded-full"
      >
        <div className="hidden group-hover:hidden lg:block">
          <ArrowDownIcon size={24} className="fill-dark-700" />
        </div>
        <div className="group-hover:block lg:hidden">
          <SwitchIcon size={24} className="fill-dark-700" />
        </div>
      </button>
      <div className="border-dark-300 mt-6 flex w-full flex-1 justify-between border-t border-opacity-50" />
    </div>
  );
}
