import { useEffect, useState } from "react";
import { shift, autoUpdate, size, useFloating } from "@floating-ui/react-dom";
import { FiInfo } from "react-icons/fi";
import {
  InputSelector,
  SelectionType,
  TokensI,
  NetworkOptionsI,
} from "./InputSelector";
import { SwitchIcon } from "./icons/SwitchIcon";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";
import NumericFormat from "./commons/NumericFormat";
import { QuickInputCard } from "./commons/QuickInputCard";
import BigNumber from "bignumber.js";

const networks = [
  {
    name: "Ethereum",
    icon: "/tokens/Ethereum.svg",
    tokens: [
      {
        tokenA: { name: "wBTC", icon: "/tokens/wBTC.svg" },
        tokenB: { name: "dBTC", icon: "/tokens/dBTC.svg" },
      },
      {
        tokenA: { name: "USDT", icon: "/tokens/USDT.svg" },
        tokenB: { name: "dUSDT", icon: "/tokens/dUSDT.svg" },
      },
      {
        tokenA: { name: "USDC", icon: "/tokens/USDC.svg" },
        tokenB: { name: "dUSDC", icon: "/tokens/dUSDC.svg" },
      },
      {
        tokenA: { name: "ETH", icon: "/tokens/ETH.svg" },
        tokenB: { name: "dETH", icon: "/tokens/dETH.svg" },
      },
    ],
  },
  {
    name: "DeFiChain",
    icon: "/tokens/DeFichain.svg",
    tokens: [
      {
        tokenA: { name: "dBTC", icon: "/tokens/dBTC.svg" },
        tokenB: { name: "wBTC", icon: "/tokens/wBTC.svg" },
      },
      {
        tokenA: { name: "dUSDT", icon: "/tokens/dUSDT.svg" },
        tokenB: { name: "USDT", icon: "/tokens/USDT.svg" },
      },
      {
        tokenA: { name: "dUSDC", icon: "/tokens/dUSDC.svg" },
        tokenB: { name: "USDC", icon: "/tokens/USDC.svg" },
      },
      {
        tokenA: { name: "dETH", icon: "/tokens/dETH.svg" },
        tokenB: { name: "ETH", icon: "/tokens/ETH.svg" },
      },
    ],
  },
];

export default function BridgeForm() {
  const [defaultNetworkA, defaultNetworkB] = networks;
  const [selectedNetworkA, setSelectedNetworkA] = useState(defaultNetworkA);
  const [selectedTokensA, setSelectedTokensA] = useState(
    defaultNetworkA.tokens[0]
  );
  const [selectedNetworkB, setSelectedNetworkB] = useState(defaultNetworkB);
  const [selectedTokensB, setSelectedTokensB] = useState(
    defaultNetworkB.tokens[0]
  );
  const [amount, setAmount] = useState<string>("");

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
    <div className="w-full dark-card-bg-image p-6 md:pt-8 pb-16 lg:p-12 rounded-lg border border-dark-200 backdrop-blur-[18px]">
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
        <span className="pl-4 lg:pl-5 text-dark-900 font-semibold text-xs lg:text-base">
          Amount to transfer
        </span>
        <QuickInputCard
          maxValue={new BigNumber(100)}
          onChange={setAmount}
          value={amount}
          showAmountsBtn
          // error="test"
        />
      </div>
      <SwitchButton onClick={switchNetwork} />

      <div className="flex flex-row items-center mb-8">
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
      <div className="flex flex-row justify-between items-center px-4 lg:px-5">
        <div className="flex flex-row items-center">
          <span className="text-dark-700 text-xs lg:text-base">Fees</span>
          {/* TODO add onclick info */}
          <button type="button">
            <FiInfo size={16} className="text-dark-700 ml-2" />
          </button>
        </div>
        <NumericFormat
          className="text-left text-dark-1000 text-xs lg:text-base"
          value={0}
          decimalScale={2}
          thousandSeparator
          suffix={` ${selectedTokensA.tokenA.name}`}
        />
      </div>
      <div className="px-6 md:px-4 lg:px-[88px] mt-8 md:mt-6 lg:mt-16 lg:mb-0">
        <button
          type="button"
          className="p-3.5 md:p-2.5 lg:p-4 bg-dark-1000 w-full text-dark-00 text-lg lg:text-xl font-bold rounded-[92px]"
        >
          Connect wallet
        </button>
      </div>
    </div>
  );
}

function SwitchButton({ onClick }) {
  return (
    <div className="my-8 flex flex-row">
      <div className="w-full flex justify-between border-t border-dark-300 border-opacity-50 mt-6 flex-1" />
      <button
        type="button"
        onClick={onClick}
        className="flex justify-center items-center dark-card-bg dark-bg-card-section w-12 h-12 rounded-full group"
      >
        <div className="hidden lg:block group-hover:hidden">
          <ArrowDownIcon size={24} className="fill-dark-700" />
        </div>
        <div className="lg:hidden group-hover:block">
          <SwitchIcon size={24} className="fill-dark-700" />
        </div>
      </button>
      <div className="w-full flex justify-between border-t border-dark-300 border-opacity-50 mt-6 flex-1" />
    </div>
  );
}
