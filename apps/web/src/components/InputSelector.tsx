import clsx from "clsx";
import Image from "next/image";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { MdCheckCircle } from "react-icons/md";
import { FiChevronDown, FiArrowRight } from "react-icons/fi";
import { Strategy } from "@floating-ui/react-dom";
import { SelectionType, NetworkOptionsI, TokensI } from "types";

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
  onSelect?: (value: any) => void;
  value: NetworkOptionsI | TokensI;
}

function Divider() {
  return <div className="mx-5 border-t-[0.5px] border-[#42424280] lg:mx-6" />;
}

function NetworkOptions({ options }: { options: NetworkOptionsI[] }) {
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
                    <MdCheckCircle className="h-6 w-6 text-[#00AD1D]" />
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

function TokenOptions({ options }: { options: TokensI[] }) {
  return (
    <div>
      {options?.map((option) => (
        <Listbox.Option
          key={option.tokenA.name}
          className="relative cursor-pointer select-none"
          value={option}
        >
          {({ selected, active }) => (
            <>
              <Divider />
              <div
                className={clsx(
                  "my-1 px-5 py-3 lg:my-2 lg:px-6 lg:py-4",
                  active && "bg-dark-gradient-1"
                )}
              >
                <div className="flex flex-row items-center justify-between">
                  <div className="flex w-4/12 flex-row items-center">
                    <Image
                      width={100}
                      height={100}
                      className="h-6 w-6 lg:h-[28px] lg:w-[28px]"
                      data-testid={option.tokenA.name}
                      src={option.tokenA.icon}
                      alt={option.tokenA.name}
                    />
                    <span className="ml-2 truncate text-base lg:text-lg text-dark-1000">
                      {option.tokenA.name}
                    </span>
                  </div>
                  <div className="flex w-2/12 flex-row items-center justify-center">
                    <FiArrowRight size={15} className="h-4 w-4 text-dark-500" />
                  </div>
                  <div className="flex w-4/12 flex-row items-center">
                    <Image
                      width={100}
                      height={100}
                      className="h-6 w-6 lg:h-[28px] lg:w-[28px]"
                      data-testid={option.tokenB.name}
                      src={option.tokenB.icon}
                      alt={option.tokenB.name}
                    />
                    <span className="ml-2 truncate text-base lg:text-lg text-dark-900">
                      {option.tokenB.name}
                    </span>
                  </div>
                  <div className="flex w-2/12 flex-row items-center justify-end">
                    {selected && (
                      <MdCheckCircle className="h-6 w-6 text-[#00AD1D]" />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </Listbox.Option>
      ))}
    </div>
  );
}

export default function InputSelector({
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
      <span className="text-dark-900 pl-4 lg:pl-5 text-xs font-semibold lg:text-base xl:tracking-wider">
        {label}
      </span>
      <Listbox value={value} onChange={onSelect}>
        {({ open }) => (
          <div className="relative mt-1 lg:mt-2">
            <Listbox.Button
              onClick={(event: { preventDefault: () => void }) => {
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
                  "dark-card-bg-image flex h-full w-full flex-row items-center justify-between bg-dark-100 py-3 pl-5 pr-3 text-left lg:px-5 lg:py-[18px]",
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
                    className="h-6 w-6 lg:h-9 lg:w-9"
                  />
                  <span className="ml-2 block truncate text-sm text-dark-1000 lg:text-xl">
                    {name}
                  </span>
                </div>
                {!disabled && (
                  <span className="text-dark-900">
                    <FiChevronDown
                      className={clsx(
                        "h-5 w-5 text-dark-900 transition-[transform] lg:h-6 lg:w-6",
                        {
                          "rotate-180": open,
                        }
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
                    "absolute z-10 mt-2 w-full w-56 overflow-auto rounded-lg p-px outline-0",
                    { "right-0": type !== SelectionType.Network },
                    open ? "bg-gradient-2" : "bg-dark-200"
                  )}
                >
                  <div className="rounded-lg bg-dark-00 py-4">
                    <span className="px-5 text-xs font-semibold text-dark-700 lg:px-6 lg:text-sm">
                      {popUpLabel}
                    </span>
                    <div className="mt-3 flex flex-col">
                      {type === SelectionType.Network ? (
                        <NetworkOptions
                          options={options as NetworkOptionsI[]}
                        />
                      ) : (
                        <TokenOptions options={options as TokensI[]} />
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
