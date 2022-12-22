import clsx from "clsx";
import BigNumber from "bignumber.js";
import Image from "next/image";
import { NetworkName } from "types";
import { FiXCircle } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { useNetworkContext } from "@contexts/NetworkContext";
import useResponsive from "@hooks/useResponsive";
import useDisableEscapeKey from "@hooks/useDisableEscapeKey";
import truncateTextFromMiddle from "@utils/textHelper";
import AlertInfoMessage from "@components/commons/AlertInfoMessage";
import IconTooltip from "@components/commons/IconTooltip";
import ActionButton from "@components/commons/ActionButton";
import NumericFormat from "@components/commons/NumericFormat";
import BrLogoIcon from "@components/icons/BrLogoIcon";
import DeFiChainToERC20Transfer from "@components/erc-transfer/DeFiChainToERC20Transfer";
import { CONSORTIUM_INFO, DISCLAIMER_MESSAGE, FEES_INFO } from "../constants";

interface RowDataI {
  address: string;
  networkName: NetworkName;
  networkIcon: string;
  tokenName: string;
  tokenIcon: string;
  amount: BigNumber;
}

interface TransferData {
  from: RowDataI;
  to: RowDataI;
}

function RowData({
  data,
  label,
  networkLabel,
  isSendingToDFC = true,
}: {
  data: RowDataI;
  label: string;
  networkLabel: string;
  isSendingToDFC?: boolean;
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
          className={clsx("block w-7 h-7", "md:hidden md:w-9 md:h-9")}
        />
        <hr className="w-full border-dark-200" />
      </div>
      <div className={clsx("flex gap-4 py-6", "md:gap-2 md:py-4")}>
        <Image
          width={100}
          height={100}
          src={data.networkIcon}
          alt={data.networkName}
          className={clsx(
            "hidden w-7 h-7 ml-2",
            "md:block md:w-9 md:h-9 md:ml-0"
          )}
        />
        <div className={clsx("flex flex-col w-1/2", "md:grow md:w-auto")}>
          <span
            className={clsx(
              "text-sm text-dark-900 !leading-5 break-all",
              "md:text-base md:break-normal"
            )}
          >
            {data.address}
          </span>
          <span
            className={clsx("text-xs text-dark-700 mt-1", "md:text-sm md:mt-0")}
          >
            {networkLabel} {isSendingToDFC ? `(${data.networkName})` : ""}
          </span>
        </div>
        <div
          className={clsx(
            "flex flex-col self-center w-1/2",
            "md:self-end md:w-auto"
          )}
        >
          <span
            className={clsx(
              "!text-xl font-bold leading-6 text-right",
              "md:text-lg md:font-semibold",
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
              className={clsx(
                "w-5 h-5 order-last",
                "md:w-4 md:h-4 md:order-none"
              )}
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
  const { isMobile } = useResponsive();
  return (
    <>
      <AlertInfoMessage
        message={DISCLAIMER_MESSAGE}
        containerStyle="px-5 py-4 mt-8"
        textStyle="text-xs"
      />
      <div className={clsx("px-6 py-8", "md:px-[72px] md:pt-16")}>
        {/* TODO: Add onClick function */}
        <ActionButton
          label={isMobile ? "Confirm transfer" : "Confirm transfer on wallet"}
          onClick={() => {}}
        />
      </div>
    </>
  );
}

export default function ConfirmTransferModal({
  show,
  onClose,
  amount,
  fromAddress,
  toAddress,
}: {
  show: boolean;
  onClose: () => void;
  amount: string;
  fromAddress: string;
  toAddress: string;
}) {
  const {
    selectedNetworkA,
    selectedTokensA,
    selectedNetworkB,
    selectedTokensB,
  } = useNetworkContext();
  const { isMobile } = useResponsive();
  useDisableEscapeKey(show);

  // Direction of transfer
  const isSendingToDFC = selectedNetworkB.name === NetworkName.DeFiChain;

  const data: TransferData = {
    from: {
      address: (isSendingToDFC ? fromAddress : "DeFiChain address") as string,
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

  // TODO: Replace with real address
  const consortiumAddress = "df10szLaksgysjl088man5vfmsm6wsstquabds9123";

  return (
    <Dialog as="div" className="relative z-10" open={show} onClose={onClose}>
      <Dialog.Panel className="transform transition-all fixed inset-0 bg-dark-00 bg-opacity-70 backdrop-blur-[18px] overflow-auto">
        <div
          className={clsx(
            "relative w-full h-full dark-card-bg-image border-dark-card-stroke backdrop-blur-[18px] m-auto px-6 pt-8 pb-12",
            "md:w-[626px] md:h-auto md:top-[calc(50%+30px)] md:-translate-y-1/2 md:rounded-xl md:border md:p-8 overflow-auto"
          )}
        >
          <Dialog.Title
            as="div"
            className="flex items-center justify-between mb-8 md:mb-6"
          >
            <h3
              className={clsx(
                "text-2xl font-bold text-dark-900",
                "md:font-semibold md:leading-9 md:tracking-wide"
              )}
            >
              Transfer
            </h3>
            <FiXCircle
              size={isMobile ? 24 : 28}
              className="text-dark-900 cursor-pointer hover:opacity-70 text-2xl md:text-[28px]"
              onClick={onClose}
            />
          </Dialog.Title>
          <RowData
            data={data.from}
            label="FROM"
            networkLabel="Source"
            isSendingToDFC={isSendingToDFC}
          />
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
                  position="right"
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
          <div className="flex justify-between items-baseline mt-4 md:mt-2 py-2">
            <div className="inline-flex items-center">
              <span className="text-dark-700 text-sm md:text-base">
                Consortium
              </span>
              <div className="ml-2">
                <IconTooltip
                  title={CONSORTIUM_INFO.title}
                  content={CONSORTIUM_INFO.content}
                  position="right"
                />
              </div>
            </div>
            <div>
              <span className="text-right text-dark-900 tracking-[0.01em] md:tracking-normal">
                {truncateTextFromMiddle(consortiumAddress, 8)}
              </span>
              <div className="flex items-center mt-2 md:mt-1">
                <BrLogoIcon />
                <span className="text-xs md:text-sm text-dark-700 ml-2">
                  Birthday Research
                </span>
              </div>
            </div>
          </div>

          {isSendingToDFC ? (
            <ERC20ToDeFiChainTransfer />
          ) : (
            <DeFiChainToERC20Transfer />
          )}
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
