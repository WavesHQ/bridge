import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { shift, autoUpdate, size, useFloating } from "@floating-ui/react-dom";
import { ConnectKitButton } from "connectkit";
import BigNumber from "bignumber.js";
import { networks, useNetworkContext } from "@contexts/NetworkContext";
import {
  Network,
  SelectionType,
  TokensI,
  NetworkOptionsI,
  NetworkName,
} from "types";
import { QuickInputCard } from "./commons/QuickInputCard";
import InputSelector from "./InputSelector";
import SwitchIcon from "./icons/SwitchIcon";
import ArrowDownIcon from "./icons/ArrowDownIcon";
import NumericFormat from "./commons/NumericFormat";
import WalletAddressInput from "./WalletAddressInput";
import DailyLimit from "./DailyLimit";
import IconTooltip from "./commons/IconTooltip";
import ActionButton from "./commons/ActionButton";
import ConfirmTransferModal from "./ConfirmTransferModal";
import { FEES_INFO } from "../constants";

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
  const [addressInput, setAddressInput] = useState<string>("");
  const [hasAddressInputErr, setHasAddressInputErr] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const { address, isConnected } = useAccount();
  const { data } = useBalance({ address });
  const maxAmount = new BigNumber(data?.formatted ?? 100); // TODO: Replace default 100 with 0 before release

  const switchNetwork = () => {
    setSelectedNetworkA(selectedNetworkB);
  };

  const onInputChange = (value: string): void => {
    // regex to allow only number
    const re = /^\d*\.?\d*$/;
    if (value === "" || re.test(value)) {
      setAmount(value);

      const isSendingToDFC = selectedNetworkB.name === NetworkName.DeFiChain;
      let err = "";
      if (isSendingToDFC && new BigNumber(value).gt(maxAmount)) {
        err = "Insufficient Funds";
      }
      setAmountErr(err);
    }
  };

  const onTransferTokens = (): void => {
    /* TODO: Handle token transfer here */
    setShowConfirmModal(true);
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

  const isFormValid =
    amount && new BigNumber(amount).gt(0) && !amountErr && !hasAddressInputErr;

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
          <span className="text-xs lg:text-sm text-error empty:before:content-['*'] empty:before:opacity-0">
            {amountErr}
          </span>
          {selectedNetworkA.name === Network.Ethereum && !amountErr && (
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
          addressInput={addressInput}
          onAddressInputChange={(addrInput) => setAddressInput(addrInput)}
          onAddressInputError={(hasError) => setHasAddressInputErr(hasError)}
          disabled={!isConnected}
        />
      </div>
      <div className="flex flex-row justify-between items-center px-4 lg:px-5">
        <div className="flex flex-row items-center">
          <span className="text-dark-700 text-xs lg:text-base font-semibold md:font-normal">
            Fees
          </span>
          <div className="ml-2">
            <IconTooltip title={FEES_INFO.title} content={FEES_INFO.content} />
          </div>
        </div>
        <NumericFormat
          className="text-left text-xs text-dark-1000 lg:text-base"
          value={0}
          decimalScale={2}
          thousandSeparator
          suffix=" DFI" // TODO: Create hook to get fee based on source/destination
        />
      </div>
      <div className="block md:hidden px-5 mt-4">
        <DailyLimit />
      </div>
      <div className="mt-8 px-6 md:mt-6 md:px-4 lg:mt-16 lg:mb-0 lg:px-0 xl:px-20">
        <ConnectKitButton.Custom>
          {({ show }) => (
            <ActionButton
              label={
                isConnected
                  ? `Transfer to ${NetworkName[selectedNetworkB.name]}`
                  : "Connect wallet"
              }
              disabled={isConnected && !isFormValid}
              onClick={!isConnected ? show : () => onTransferTokens()}
            />
          )}
        </ConnectKitButton.Custom>
      </div>
      <ConfirmTransferModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        amount={amount}
        toAddress={addressInput}
      />
    </div>
  );
}
