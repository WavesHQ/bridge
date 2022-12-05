import { useNetworkContext } from "@contexts/NetworkContext";
import useResponsive from "@hooks/useResponsive";
import BigNumber from "bignumber.js";
import IconTooltip from "./commons/IconTooltip";
import NumericFormat from "./commons/NumericFormat";
import ProgressBar from "./commons/ProgressBar";

const DAILY_CAP = {
  dailyLimit: 25,
  reachedLimit: 12.675,
};

export default function DailyLimit() {
  const { isXl } = useResponsive();
  const { selectedTokensA } = useNetworkContext();
  const limitPercentage = new BigNumber(DAILY_CAP.reachedLimit)
    .dividedBy(DAILY_CAP.dailyLimit)
    .multipliedBy(100)
    .decimalPlaces(2);

  const getFillColor = () => {
    let color = "bg-error";
    if (limitPercentage.lte(50)) {
      color = "bg-dark-grdient-3";
    } else if (limitPercentage.lte(75)) {
      color = "bg-warning";
    }
    return color;
  };

  return (
    <div className="flex flex-wrap justify-between items-baseline md:block">
      <div className="flex items-center md:mb-2">
        <span className="text-xs lg:text-sm font-semibold lg:tracking-wide text-dark-700 md:uppercase">
          Daily limit
        </span>
        <div className="ml-2">
          <IconTooltip
            title="Daily Limit"
            content="DeFi Bridge has a daily hard cap for each token pair. Once this limit is reached, you will not be able to transfer to DeFiChain or Ethereum until the next day."
          />
        </div>
      </div>
      <div className="w-full order-last mt-2 md:mt-0">
        <ProgressBar
          progressPercentage={limitPercentage}
          fillColor={getFillColor()}
        />
      </div>
      <div className="md:mt-2 flex items-center text-xs md:text-sm lg:text-base">
        <NumericFormat
          className="text-dark-900"
          value={DAILY_CAP.reachedLimit}
          decimalScale={3}
          thousandSeparator
          suffix={` ${selectedTokensA.tokenA.symbol}`}
        />
        <span className="hidden md:block text-dark-700 ml-1">
          {`(${limitPercentage}%${isXl ? " reached" : ""})`}
        </span>
        <NumericFormat
          className="self-end text-right text-dark-700 grow ml-0.5"
          value={DAILY_CAP.dailyLimit}
          decimalScale={0}
          thousandSeparator
          prefix="/"
          suffix={` ${selectedTokensA.tokenA.symbol}`}
        />
      </div>
    </div>
  );
}
