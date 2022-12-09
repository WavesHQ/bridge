import clsx from "clsx";
import BigNumber from "bignumber.js";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useNetworkContext } from "@contexts/NetworkContext";
import useResponsive from "@hooks/useResponsive";
import useDisableEscapeKey from "@hooks/useDisableEscapeKey";
import truncateTextFromMiddle from "@utils/textHelper";
import { NetworkName } from "types";
import { FiXCircle, FiAlertTriangle } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import IconTooltip from "./commons/IconTooltip";
import ActionButton from "./commons/ActionButton";
import NumericFormat from "./commons/NumericFormat";
import BrLogoIcon from "./icons/BrLogoIcon";
import DeFiChainToERC20Transfer from "./DeFiChainToERC20Transfer";
import { CONSORTIUM_INFO, FEES_INFO } from "../constants";

interface RowDataI {
  address: string;
  networkName: NetworkName;
  networkIcon: string;
  tokenName: string;
  tokenIcon: string;
  amount: BigNumber;
}

function RowData({
  data,
  label,
  networkLabel,
}: {
  data: RowDataI;
  label: string;
  networkLabel: string;
}) {
  return (
    <div>
      <div className="flex flex-row items-center gap-2">
        <span className="text-sm font-semibold tracking-wide text-dark-500">
          {label}
        </span>
        <Image
          width={100}
          height={100}
          src={data.networkIcon}
          alt={data.networkName}
          className="block md:hidden w-7 h-7 md:w-9 md:h-9"
        />
        <hr className="w-full border-dark-200" />
      </div>
      <div className="flex gap-4 md:gap-2 py-6 md:py-4">
        <Image
          width={100}
          height={100}
          src={data.networkIcon}
          alt={data.networkName}
          className="hidden md:block w-7 h-7 md:w-9 md:h-9 ml-2 md:ml-0"
        />
        <div className="flex flex-col md:grow w-1/2 md:w-auto">
          <span className="text-sm md:text-base text-dark-900 !leading-5 break-all md:break-normal">
            {data.address}
          </span>
          <span className="text-xs md:text-sm text-dark-700 mt-1 md:mt-0">
            {networkLabel} ({data.networkName})
          </span>
        </div>
        <div className="flex flex-col self-center md:self-end w-1/2 md:w-auto">
          <span
            className={clsx(
              "!text-xl font-bold md:text-lg md:font-semibold leading-6 text-right",
              data.amount.isPositive() ? "text-valid" : "text-error"
            )}
          >
            {data.amount.toFixed(2)}
          </span>
          <div className="flex items-center justify-end gap-1">
            <Image
              width={100}
              height={100}
              src={data.tokenIcon}
              alt={data.tokenName}
              className="w-5 h-5 md:w-4 md:h-4 order-last md:order-none"
            />
            <span className="text-sm text-dark-700 mt-0.5 md:mt-0">
              {data.tokenName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ERC20ToDeFiChainTransfer() {
  return (
    <>
      <div className="flex items-center dark-bg-card-section rounded-md mt-20 md:mt-4 px-4 py-3">
        <FiAlertTriangle size={20} className="shrink-0 text-dark-500" />
        <span className="text-xs text-dark-700 ml-3">
          Make sure that your Destination address and details are correct.
          Transactions are irreversible.
        </span>
      </div>
      <div className="px-6 py-8 md:px-[72px] md:pt-16 md:pb-0">
        {/* TODO: Add onClick function */}
        <ActionButton label="Confirm transfer" onClick={() => {}} />
      </div>
    </>
  );
}

export default function ConfirmTransferModal({
  show,
  onClose,
  amount,
  toAddress,
}: {
  show: boolean;
  onClose: () => void;
  amount: string;
  toAddress: string;
}) {
  const {
    selectedNetworkA,
    selectedTokensA,
    selectedNetworkB,
    selectedTokensB,
  } = useNetworkContext();
  const { address } = useAccount();
  const { isMobile } = useResponsive();
  useDisableEscapeKey(show);

  const data = {
    from: {
      address: address ?? "",
      networkName: NetworkName[selectedNetworkA.name],
      networkIcon: selectedNetworkA.icon,
      tokenName: selectedTokensA.tokenA.name,
      tokenIcon: selectedTokensA.tokenA.icon,
      amount: new BigNumber(amount).negated(),
    },
    to: {
      address: toAddress,
      networkName: NetworkName[selectedNetworkB.name],
      networkIcon: selectedNetworkB.icon,
      tokenName: selectedTokensB.tokenA.name,
      tokenIcon: selectedTokensB.tokenA.icon,
      amount: new BigNumber(amount),
    },
  };

  // Direction of transfer
  const isSendingToDeFiChain = data.to.networkName === NetworkName.DeFiChain;

  return (
    <Dialog as="div" className="relative z-10" open={show} onClose={onClose}>
      <Dialog.Panel className="transform transition-all fixed inset-0 bg-dark-00 bg-opacity-70 backdrop-blur-[18px] overflow-auto">
        <div className="relative w-full h-full md:w-[626px] md:h-auto md:top-1/2 md:-translate-y-1/2 dark-card-bg-image md:rounded-xl md:border border-dark-card-stroke backdrop-blur-[18px] m-auto px-6 pt-8 pb-12 md:p-8 md:pb-16">
          <Dialog.Title
            as="div"
            className="flex items-center justify-between mb-8 md:mb-6"
          >
            <h3 className="text-2xl font-bold md:font-semibold md:leading-9 md:tracking-wide text-dark-900">
              Transfer
            </h3>
            <FiXCircle
              size={isMobile ? 24 : 28}
              className="text-dark-900 cursor-pointer hover:opacity-70 text-2xl md:text-[28px]"
              onClick={onClose}
            />
          </Dialog.Title>
          <RowData data={data.from} label="FROM" networkLabel="Source" />
          <RowData data={data.to} label="TO" networkLabel="Destination" />
          <div className="w-full border-t border-t-dark-200 md:mt-3" />

          {/* Fees */}
          <div className="flex justify-between mt-6 md:mt-5 py-2">
            <div className="inline-flex items-center">
              <span className="text-dark-700 text-sm md:text-base">Fees</span>
              <div className="ml-2">
                <IconTooltip
                  title={FEES_INFO.title}
                  content={FEES_INFO.content}
                />
              </div>
            </div>
            <NumericFormat
              className="text-right text-dark-900 tracking-[0.01em] md:tracking-normal"
              value={0}
              decimalScale={2}
              thousandSeparator
              suffix=" DFI" // TODO: Create hook to get fee based on source/destination
            />
          </div>

          {/* Consortium */}
          <div className="flex justify-between align-top mt-4 md:mt-2 py-2">
            <div className="inline-flex items-center">
              <span className="text-dark-700 text-sm md:text-base">
                Consortium
              </span>
              <div className="ml-2">
                <IconTooltip
                  title={CONSORTIUM_INFO.title}
                  content={CONSORTIUM_INFO.content}
                />
              </div>
            </div>
            <div>
              <span className="text-right text-dark-900 tracking-[0.01em] md:tracking-normal">
                {truncateTextFromMiddle(data.to.address, 8)}
              </span>
              <div className="flex items-center mt-2 md:mt-1">
                <BrLogoIcon />
                <span className="text-xs md:text-sm text-dark-700 ml-2">
                  Birthday research
                </span>
              </div>
            </div>
          </div>

          {isSendingToDeFiChain ? (
            <ERC20ToDeFiChainTransfer />
          ) : (
            <DeFiChainToERC20Transfer />
          )}
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
