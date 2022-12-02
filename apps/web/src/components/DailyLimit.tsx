import { useNetworkContext } from "@contexts/NetworkContext";
import BigNumber from "bignumber.js";
import { FiInfo } from "react-icons/fi";
import ProgressBar from "./commons/ProgressBar";

const DAILY_CAP = {
  dailyLimit: 25,
  usedLimit: 12.675,
};

export default function DailyLimit() {
  const { selectedTokensA } = useNetworkContext();
  const limitPercentage = new BigNumber(DAILY_CAP.usedLimit)
    .dividedBy(DAILY_CAP.dailyLimit)
    .multipliedBy(100)
    .decimalPlaces(0, BigNumber.ROUND_DOWN);

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
        <span className="text-xs lg:text-sm font-semibold lg:tracking-wide text-dark-700">
          DAILY LIMIT
        </span>
        <button type="button" className="ml-2">
          {/* TODO: Disply daily limit info onclick */}
          <FiInfo size={16} className="text-dark-700" />
        </button>
      </div>
      <div className="w-full order-last mt-2 md:mt-0">
        <ProgressBar
          progressPercentage={limitPercentage}
          fillColor={getFillColor()}
        />
      </div>
      <div className="md:mt-2 flex items-center justify-between">
        <span className="text-xs md:text-sm lg:text-base text-dark-900">
          {`${DAILY_CAP.usedLimit} ${selectedTokensA.tokenA.symbol} (${limitPercentage}%)`}
        </span>
        <span className="hidden md:inline-block text-sm lg:text-base text-dark-700">
          {`/${DAILY_CAP.dailyLimit} ${selectedTokensA.tokenA.symbol}`}
        </span>
      </div>
    </div>
  );
}