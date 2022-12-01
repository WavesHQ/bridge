import clsx from "clsx";
import Image from "next/image";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FaCheckCircle } from "react-icons/fa";
import { FiChevronDown, FiArrowRight } from "react-icons/fi";
import { Strategy } from "@floating-ui/react-dom";

export enum SelectionType {
  Network = "Network",
  Token = "Token",
}

export interface TokenDetailI {
  name: string;
  icon: string;
}

export interface TokensI {
  tokenA: TokenDetailI;
  tokenB: TokenDetailI;
}
export interface NetworkOptionsI extends TokenDetailI {
  tokens: TokensI[];
}

interface SelectorI {
  disabled?: boolean;
  label: string;
  type: SelectionType;
  popUpLabel: string;
  floatingObj: {
    floating: (node: HTMLElement | null) => void;
    strategy: Strategy;
    y: number | null;
  };
  options?: NetworkOptionsI[] | TokensI[];
  onSelect?: (value: NetworkOptionsI | TokensI) => void;
  value: NetworkOptionsI | TokensI;
}

export function InputSelector({
  options,
  label,
  popUpLabel,
  onSelect,
  value,
  floatingObj,
  type,
  disabled = false,
}: SelectorI) {
  const { floating, y, strategy } = floatingObj;
  const roundedBorderStyle =
    type === SelectionType.Network ? "rounded-l-lg" : "rounded-r-lg";
  const { name, icon } =
    type === SelectionType.Network
      ? (value as NetworkOptionsI)
      : (value as TokensI).tokenA;
  return (
    <div>
      <span className="pl-4 lg:pl-5 text-dark-900 font-semibold text-xs lg:text-base">
        {label}
      </span>
      <Listbox value={value} onChange={onSelect}>
        {({ open }) => (
          <div className="relative mt-1 lg:mt-2">
            <Listbox.Button
              onClick={(event) => {
                if (disabled) {
                  event.preventDefault();
                }
              }}
              className={clsx(
                "relative w-full outline-0",
                disabled && "cursor-default",
                type === SelectionType.Network ? "p-px pr-0" : "p-px",
                open ? "bg-gradient-2 pr-px" : "bg-dark-200",
                roundedBorderStyle
              )}
            >
              <div
                className={clsx(
                  "flex flex-row justify-between items-center h-full w-full bg-dark-100 dark-card-bg-image pl-5 pr-3 py-3 lg:px-5 lg:py-[18px] text-left",
                  roundedBorderStyle
                )}
              >
                <div className="flex flex-row items-center">
                  <Image
                    width={100}
                    height={100}
                    src={icon}
                    alt={name}
                    data-testid={name}
                    className="w-6 h-6 lg:w-9 lg:h-9"
                  />
                  <span className="block truncate text-dark-1000 ml-2 text-sm lg:text-xl">
                    {name}
                  </span>
                </div>
                {!disabled && (
                  <span className="text-dark-900">
                    <FiChevronDown
                      className={clsx(
                        "h-5 w-5 lg:h-6 lg:w-6 text-dark-900 transition-[transform]",
                        { "rotate-180": open }
                      )}
                    />
                  </span>
                )}
              </div>
            </Listbox.Button>
            {!disabled && (
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  ref={floating}
                  style={{
                    position: strategy,
                    top: y ?? "",
                  }}
                  className={clsx(
                    "absolute mt-2 w-full w-56 overflow-auto rounded-lg p-px z-10 outline-0",
                    { "right-0": type !== SelectionType.Network },
                    open ? "bg-gradient-2" : "bg-dark-200"
                  )}
                >
                  <div className="bg-dark-00 rounded-lg py-4">
                    <span className="text-dark-700 font-semibold text-xs lg:text-sm px-5 lg:px-6">
                      {popUpLabel}
                    </span>
                    <div className="flex flex-col mt-3">
                      {type === SelectionType.Network ? (
                        <NetworkOptions options={options} />
                      ) : (
                        <TokenOptions options={options} />
                      )}
                    </div>
                  </div>
                </Listbox.Options>
              </Transition>
            )}
          </div>
        )}
      </Listbox>
    </div>
  );
}

function NetworkOptions({ options }) {
  return (
    <>
      {options.map((option) => (
        <Listbox.Option
          key={option.name}
          className="relative select-none cursor-pointer"
          value={option}
        >
          {({ selected, active }) => (
            <>
              <Divider />
              <div
                className={clsx(
                  "px-5 lg:px-6 py-3 lg:py-4 my-1 lg:my-2",
                  active && "bg-dark-gradient-1"
                )}
              >
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center">
                    <Image
                      width={100}
                      height={100}
                      className="w-6 h-6 lg:w-[28px] lg:h-[28px]"
                      data-testid={option.name}
                      src={option.icon}
                      alt={option.name}
                    />
                    <span className="truncate text-dark-1000 ml-2 text-base lg:text-lg">
                      {option.name}
                    </span>
                  </div>
                  {selected && (
                    <FaCheckCircle className="h-6 w-6 text-[#00AD1D]" />
                  )}
                </div>
              </div>
            </>
          )}
        </Listbox.Option>
      ))}
    </>
  );
}

function TokenOptions({ options }) {
  return (
    <>
      {options.map((option) => (
        <Listbox.Option
          key={option.tokenA.name}
          className="relative select-none cursor-pointer"
          value={option}
        >
          {({ selected, active }) => (
            <>
              <Divider />
              <div
                className={clsx(
                  "px-5 lg:px-6 py-3 lg:py-4 my-1 lg:my-2",
                  active && "bg-dark-gradient-1"
                )}
              >
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row w-4/12 items-center">
                    <Image
                      width={100}
                      height={100}
                      className="w-6 h-6 lg:w-[28px] lg:h-[28px]"
                      data-testid={option.tokenA.name}
                      src={option.tokenA.icon}
                      alt={option.tokenA.name}
                    />
                    <span className="truncate text-dark-1000 ml-2 text-base lg:text-lg">
                      {option.tokenA.name}
                    </span>
                  </div>
                  <div className="flex flex-row w-2/12 justify-center items-center">
                    <FiArrowRight size={15} className="h-4 w-4 text-dark-500" />
                  </div>
                  <div className="flex flex-row w-4/12 items-center">
                    <Image
                      width={100}
                      height={100}
                      className="w-6 h-6 lg:w-[28px] lg:h-[28px]"
                      data-testid={option.tokenB.name}
                      src={option.tokenB.icon}
                      alt={option.tokenB.name}
                    />
                    <span className="truncate text-dark-900 ml-2 text-base lg:text-lg">
                      {option.tokenB.name}
                    </span>
                  </div>
                  <div className="flex flex-row w-2/12 justify-end items-center">
                    {selected && (
                      <FaCheckCircle className="h-6 w-6 text-[#00AD1D]" />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </Listbox.Option>
      ))}
    </>
  );
}

function Divider() {
  return <div className="mx-5 lg:mx-6 border-t-[0.5px] border-[#42424280]" />;
}
