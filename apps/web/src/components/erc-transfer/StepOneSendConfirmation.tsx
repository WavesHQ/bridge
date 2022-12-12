import clsx from "clsx";
import { useState, useEffect } from "react";
import { FiAlertCircle, FiCopy } from "react-icons/fi";
import QRCode from "react-qr-code";
import useCopyToClipboard from "@hooks/useCopyToClipboard";
import useResponsive from "@hooks/useResponsive";
import Tooltip from "@components/commons/Tooltip";
import UtilityButton from "@components/commons/UtilityButton";
import TimeLimitCounter from "./TimeLimitCounter";

const generateDfcUniqueAddress = () => {
  // TODO: Replace with real api function to generate unique DFC address
  const address: string = Array.from(Array(42), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
  return address;
};

function ConfirmButton({
  onConfirm,
  disabled = false,
}: {
  onConfirm: () => void;
  disabled?: boolean;
}) {
  return (
    <UtilityButton
      label="Confirm send"
      onClick={onConfirm}
      disabled={disabled}
      withArrowIcon
    />
  );
}

function SuccessCopy({
  containerClass,
  show,
}: {
  containerClass: string;
  show: boolean;
}) {
  return (
    <div
      className={clsx(
        "absolute md:w-full md:text-center",
        show ? "opacity-100" : "opacity-0",
        containerClass
      )}
    >
      <span className="rounded bg-valid px-2 py-1 text-2xs text-dark-00  transition duration-300 md:text-xs">
        Copied to clipboard
      </span>
    </div>
  );
}

export default function StepOneSendConfirmation({
  goToNextStep,
}: {
  goToNextStep: () => void;
}) {
  const [dfcUniqueAddress, setDfcUniqueAddress] = useState<string>("");
  const [showSuccessCopy, setShowSuccessCopy] = useState(false);
  const [hasTimeElapsed, setHasTimeElapsed] = useState(false);

  const { isMobile } = useResponsive();
  const { copy } = useCopyToClipboard();

  const handleConfirmClick = () => {
    goToNextStep();
  };

  const handleOnCopy = (text) => {
    copy(text);
    setShowSuccessCopy(true);
  };

  const handleGenerateNewDfcAddress = () => {
    const newAddress = generateDfcUniqueAddress();
    setDfcUniqueAddress(newAddress);
    setHasTimeElapsed(false);
  };

  useEffect(() => {
    const uniqueAddress = generateDfcUniqueAddress();
    setDfcUniqueAddress(uniqueAddress);
  }, []);

  useEffect(() => {
    if (showSuccessCopy) {
      setTimeout(() => setShowSuccessCopy(false), 2000);
    }
  }, [showSuccessCopy]);

  return (
    <div className={clsx("flex flex-col gap-7 mt-6", "md:flex-row md:mt-4")}>
      <div
        className={clsx(
          "w-full flex flex-row gap-4 order-1",
          "md:w-2/5 md:flex-col md:shrink-0 md:gap-3 md:order-none md:border-[0.5px] border-dark-200 rounded md:px-5 md:pt-4 md:pb-3",
          { "justify-center": hasTimeElapsed }
        )}
      >
        {hasTimeElapsed ? (
          <div className="flex flex-col items-center justify-center">
            <FiAlertCircle size={48} className="text-dark-1000" />
            <span className="text-center text-xs text-dark-900 mt-6 mb-4">
              Address has expired and is now unavailable for use.
            </span>
            <div className="w-full px-6 md:w-auto md:px-0 md:pb-2">
              <UtilityButton
                label="Generate again"
                variant="secondary"
                onClick={() => handleGenerateNewDfcAddress()}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="w-[164px] h-[164px] bg-dark-1000 p-0.5 md:rounded">
              <QRCode value={dfcUniqueAddress} size={160} />
            </div>
            <div className="flex flex-col">
              <div
                className={clsx(
                  "text-xs font-semibold text-dark-700 text-left",
                  "md:text-center md:mt-3"
                )}
              >
                Unique DFC address
              </div>
              <Tooltip
                content="Click to copy address"
                containerClass={clsx("relative pt-0 mt-1", {
                  "cursor-default": isMobile,
                })}
                disableTooltip={isMobile}
              >
                <button
                  type="button"
                  className={clsx(
                    "text-sm text-dark-900 text-left break-all focus-visible:outline-none",
                    "md:text-xs md:text-center md:cursor-pointer md:hover:underline"
                  )}
                  onClick={() => !isMobile && handleOnCopy(dfcUniqueAddress)}
                >
                  {dfcUniqueAddress}
                </button>
                {!isMobile && (
                  <SuccessCopy
                    containerClass="bottom-11"
                    show={showSuccessCopy}
                  />
                )}
              </Tooltip>
              {isMobile && (
                <>
                  <button
                    type="button"
                    className="relative flex items-center text-dark-700 active:text-dark-900 mt-2"
                    onClick={() => handleOnCopy(dfcUniqueAddress)}
                  >
                    <FiCopy size={16} className="mr-2" />
                    <span className="text-sm font-semibold">Copy address</span>
                    <SuccessCopy
                      containerClass="bottom-7"
                      show={showSuccessCopy}
                    />
                  </button>
                  {!hasTimeElapsed && (
                    <TimeLimitCounter
                      onTimeElapsed={() => setHasTimeElapsed(true)}
                    />
                  )}
                </>
              )}
            </div>{" "}
          </>
        )}
      </div>
      <div className="flex flex-col justify-center grow">
        <span className="font-semibold tracking-wider text-dark-900">
          Transfer DFC tokens
        </span>
        <p className={clsx("text-sm text-dark-700 mt-1", "md:mt-2")}>
          Send your DFC tokens to the unique DFC address to start the withdrawal
          process. This address is only valid for 30 minutes.
        </p>
        {!isMobile && !hasTimeElapsed && (
          <TimeLimitCounter onTimeElapsed={() => setHasTimeElapsed(true)} />
        )}

        <div className={clsx("hidden mt-12", "md:block")}>
          {/* Web confirm button */}
          <ConfirmButton
            onConfirm={handleConfirmClick}
            disabled={hasTimeElapsed}
          />
        </div>
      </div>

      <div className={clsx("order-last px-6 pt-5", "md:hidden md:px-0")}>
        {/* Mobile confirm button */}
        <ConfirmButton
          onConfirm={handleConfirmClick}
          disabled={hasTimeElapsed}
        />
      </div>
    </div>
  );
}
