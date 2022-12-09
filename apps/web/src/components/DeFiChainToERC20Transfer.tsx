import BigNumber from "bignumber.js";
import { useState, useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import QRCode from "react-qr-code";
import getDuration from "@utils/durationHelper";
import ActionButton from "./commons/ActionButton";
import ProgressBar from "./commons/ProgressBar";
import { DFC_TO_ERC_TIME_LIMIT } from "../constants";

export default function DeFiChainToERC20Transfer() {
  const [timeRemaining, setTimeRemaining] = useState(
    new BigNumber(DFC_TO_ERC_TIME_LIMIT)
  );
  const intervalRef = useRef<any>(null);

  const decreaseTimeRemaining = () => setTimeRemaining((time) => time.minus(1));
  useEffect(() => {
    intervalRef.current = setInterval(decreaseTimeRemaining, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (timeRemaining.lte(0)) {
      setTimeRemaining(new BigNumber(0));
      clearInterval(intervalRef.current);
    }
  }, [timeRemaining]);

  const timeLimitPercentage = timeRemaining
    .dividedBy(DFC_TO_ERC_TIME_LIMIT)
    .multipliedBy(100);

  const getFillColor = () => {
    let color = "bg-error";
    if (timeRemaining.gte(10 * 60)) {
      /* >= 10mins */
      color = "bg-dark-grdient-3";
    } else if (timeRemaining.gte(5 * 60)) {
      /* >= 5mins */
      color = "bg-warning";
    }
    return color;
  };

  const dfcAddress = "df1qdnru4kgysjl088man5vfmsm6wukc2refhurctf"; // TODO: Replace with real data
  return (
    <div className="dark-bg-card-section rounded-md mt-8 px-6 pb-4">
      <h3 className="text-dark-900">Navigation here....</h3>
      <div className="flex gap-7">
        {/* QR left side */}
        <div className="w-2/5 shrink-0 border-[0.5px] border-dark-200 rounded px-5 pt-4 pb-3">
          <div className="w-[164px] h-[164px] bg-dark-1000 rounded p-0.5">
            <QRCode value={dfcAddress} size={160} />
          </div>

          <div className="w-full text-center text-xs font-semibold text-dark-700 mt-3">
            Unique DFC address
          </div>
          <div className="w-full text-xs text-dark-900 text-center break-all mt-1">
            {dfcAddress}
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col justify-center grow">
          <span className="font-semibold tracking-wider text-dark-900">
            Transfer DFC tokens
          </span>
          <p className="text-sm text-dark-700 mt-2">
            Send your DFC tokens to the unique DFC address to start the
            withdrawal process. This address is only valid for 30 minutes.
          </p>

          {/* Time limit */}
          <div className="flex items-center mt-4 gap-3">
            <div className="w-3/5">
              <ProgressBar
                progressPercentage={timeLimitPercentage}
                fillColor={getFillColor()}
              />
            </div>
            <span className="text-sm font-semibold tracking-wide text-dark-1000">
              {getDuration(timeRemaining.toNumber())}
            </span>
          </div>

          {/* Confirm button */}
          <div className="mt-12">
            <ActionButton
              label="Confirm send"
              onClick={() => {}}
              variant="utility"
            />
          </div>
        </div>
      </div>

      <div className="w-full border-t border-t-dark-200 mt-5 mb-3" />
      <div className="flex items-center">
        <FiAlertTriangle size={20} className="shrink-0 text-dark-500" />
        <span className="text-xs text-dark-700 ml-3">
          Make sure that your Destination address and details are correct.
          Transactions are irreversible.
        </span>
      </div>
    </div>
  );
}
