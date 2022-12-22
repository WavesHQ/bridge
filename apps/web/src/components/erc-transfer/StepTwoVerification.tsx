import clsx from "clsx";
import { useEffect } from "react";
import AlertInfoMessage from "@components/commons/AlertInfoMessage";
import UtilityButton from "@components/commons/UtilityButton";
import { DISCLAIMER_MESSAGE } from "../../constants";

export default function StepTwoVerification({
  goToNextStep,
}: {
  goToNextStep: () => void;
}) {
  useEffect(() => {
    // TODO: Replace with real loading time from api
    setTimeout(() => goToNextStep(), 3000);
  }, []);

  return (
    <div
      className={clsx(
        "flex flex-col items-center text-center mt-12 pb-2",
        "md:flex-row md:gap-6 md:text-left md:mt-6"
      )}
    >
      <div>
        <span className="font-semibold text-dark-900 tracking-[0.01em] md:tracking-wider">
          Verifying transfer
        </span>
        <p className="text-sm text-dark-700 mt-2">
          The tokens will be available to claim once they have 10 confirmations
          on the network.
        </p>
      </div>
      <AlertInfoMessage
        message={DISCLAIMER_MESSAGE}
        containerStyle="px-5 py-4 mt-6 md:hidden"
        textStyle="text-xs"
      />
      <div className={clsx("w-full px-6 pt-12", "md:w-auto md:px-0 md:pt-0")}>
        <UtilityButton label="Verifying" isLoading disabled />
      </div>
    </div>
  );
}
