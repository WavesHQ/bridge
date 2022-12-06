import { useState } from "react";
import { shift, autoUpdate, size, useFloating } from "@floating-ui/react-dom";
import BigNumber from "bignumber.js";
import { networks, useNetworkContext } from "@contexts/NetworkContext";
import { Network, SelectionType, TokensI, NetworkOptionsI } from "types";
import { QuickInputCard } from "./commons/QuickInputCard";
import InputSelector from "./InputSelector";
import SwitchIcon from "./icons/SwitchIcon";
import ArrowDownIcon from "./icons/ArrowDownIcon";
import NumericFormat from "./commons/NumericFormat";
import WalletAddressInput from "./WalletAddressInput";
import DailyLimit from "./DailyLimit";
import IconTooltip from "./commons/IconTooltip";

function SwitchButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="my-8 flex flex-row">
      <div className="mt-6 flex w-full flex-1 justify-between border-t border-dark-300 border-opacity-50" />
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
      <div className="mt-6 flex w-full flex-1 justify-between border-t border-dark-300 border-opacity-50" />
    </div>
  );
}

export default function BridgeForm() {
  const {
    selectedNetworkA,
    selectedTokensA,
    selectedNetworkB,
    selectedTokensB,
    setSelectedNetworkA,
    setSelectedTokensA,
  } = useNetworkContext();

  const [amount, setAmount] = useState<string>("");
  const [amountErr, setAmountErr] = useState<string>("");
  // TODO remove hardcoded max amount
  const maxAmount = new BigNumber(100);

  const switchNetwork = () => {
    setSelectedNetworkA(selectedNetworkB);
  };

  const onInputChange = (value: string): void => {
    // regex to allow only number
    const re = /^\d*\.?\d*$/;
    if (value === "" || re.test(value)) {
      setAmount(value);
      let err = "";
      if (new BigNumber(value).gt(maxAmount)) {
        err = "Insufficient Funds";
      }
      setAmountErr(err);
    }
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
      <div className="mt-5">
        <span className="pl-4 text-xs font-semibold text-dark-900 lg:pl-5 lg:text-base">
          Amount to transfer
        </span>
        <QuickInputCard
          maxValue={maxAmount}
          onChange={onInputChange}
          value={amount}
          error={amountErr}
          showAmountsBtn={selectedNetworkA.name === Network.Ethereum}
        />
        <div className="flex flex-row pl-4 lg:pl-5 mt-2">
          {amountErr ? (
            <span className="text-xs lg:text-sm text-error">{amountErr}</span>
          ) : (
            <>
              <span className="text-xs lg:text-sm text-dark-700">
                Available:
              </span>
              <NumericFormat
                className="text-xs lg:text-sm text-dark-900 ml-1"
                value={maxAmount}
                decimalScale={8}
                thousandSeparator
                suffix={` ${selectedTokensA.tokenA.name}`}
              />
            </>
          )}
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
      <div className="flex flex-row justify-between items-center px-4 lg:px-5">
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
          className="text-left text-xs text-dark-1000 lg:text-base"
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
          className="w-full rounded-[92px] bg-dark-1000 p-3.5 text-lg font-bold text-dark-00 md:p-2.5 lg:p-4 lg:text-xl"
        >
          Connect wallet
        </button>
      </div>
    </div>
  );
}
