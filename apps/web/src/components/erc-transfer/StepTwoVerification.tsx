import clsx from "clsx";
import { useEffect } from "react";
import UtilityButton from "@components/commons/UtilityButton";

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
        "flex flex-col items-center gap-6 text-center mt-6 pb-2",
        "md:flex-row md:text-left"
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
      <div className={clsx("w-full px-6", "md:w-auto md:px-0")}>
        <UtilityButton label="Verifying" isLoading disabled />
      </div>
    </div>
  );
}
