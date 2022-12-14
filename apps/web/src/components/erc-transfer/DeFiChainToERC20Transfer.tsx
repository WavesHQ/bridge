import clsx from "clsx";
import { useState } from "react";
import { ProgressStepI } from "types";
import useResponsive from "@hooks/useResponsive";
import AlertInfoMessage from "@components/commons/AlertInfoMessage";
import ProgressStepIndicator from "@components/commons/ProgressStepIndicator";
import ProgressStepIndicatorMobile from "@components/commons/ProgressStepIndicatorMobile";
import StepOneSendConfirmation from "./StepOneSendConfirmation";
import StepTwoVerification from "./StepTwoVerification";
import StepThreeClaim from "./StepThreeClaim";
import { DISCLAIMER_MESSAGE } from "../../constants";

const DfcToErcTransferSteps: ProgressStepI[] = [
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
        <AlertInfoMessage
          message={DISCLAIMER_MESSAGE}
          containerStyle="px-5 py-4 mt-4 hidden md:block"
          textStyle="text-xs"
        />
      )}
    </div>
  );
}
