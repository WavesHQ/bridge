import clsx from "clsx";
import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { ProgressStepI } from "types";
import useResponsive from "@hooks/useResponsive";
import ProgressStepIndicator from "@components/commons/ProgressStepIndicator";
import ProgressStepIndicatorMobile from "@components/commons/ProgressStepIndicatorMobile";
import StepOneSendConfirmation from "./StepOneSendConfirmation";
import StepTwoVerification from "./StepTwoVerification";
import StepThreeClaim from "./StepThreeClaim";

export const DfcToErcTransferSteps: ProgressStepI[] = [
  { step: 1, label: "Transfer" },
  { step: 2, label: "Verification" },
  { step: 3, label: "Claim" },
];

export default function DeFiChainToERC20Transfer() {
  const [activeStep, setActiveStep] = useState(1);
  const { isMobile } = useResponsive();

  const handleNextStep = () => {
    setActiveStep(activeStep + 1);
  };

  return (
    <div
      className={clsx(
        "rounded-md mt-6 pt-4",
        "md:mt-8 md:dark-bg-card-section md:pb-4 md:px-6"
      )}
    >
      <div className="md:h-[60px]">
        {isMobile ? (
          <ProgressStepIndicatorMobile
            steps={DfcToErcTransferSteps}
            activeStep={activeStep}
          />
        ) : (
          <ProgressStepIndicator
            steps={DfcToErcTransferSteps}
            activeStep={activeStep}
          />
        )}
      </div>

      {activeStep === 1 && (
        <StepOneSendConfirmation goToNextStep={handleNextStep} />
      )}
      {activeStep === 2 && (
        <StepTwoVerification goToNextStep={handleNextStep} />
      )}
      {activeStep >= 3 && <StepThreeClaim goToNextStep={handleNextStep} />}

      {[1, 2].includes(activeStep) && (
        <>
          <div className="hidden md:block w-full border-t border-t-dark-200 mt-5 mb-3" />
          <div className="flex items-center">
            <FiAlertTriangle
              size={20}
              className={clsx("hidden shrink-0 text-dark-500", "md:block")}
            />
            <span
              className={clsx(
                "text-xs text-center text-dark-700 mt-3 px-6",
                "md:text-left md:ml-3 md:mt-0 md:px-0"
              )}
            >
              Make sure that your Destination address and details are correct.
              Transactions are irreversible.
            </span>
          </div>
        </>
      )}
    </div>
  );
}
