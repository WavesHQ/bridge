import clsx from "clsx";
import ActionButton from "@components/commons/ActionButton";

export default function StepThreeClaim({
  goToNextStep,
}: {
  goToNextStep: () => void;
}) {
  return (
    <div className={clsx("mt-14 px-6 pt-6", "md:mt-4 md:px-[88px] md:pb-6")}>
      <ActionButton label="Claim tokens" onClick={goToNextStep} />
      <span className="block text-center text-sm text-dark-700 mt-3">
        Complete the transaction on your connected wallet to claim your token.
      </span>
    </div>
  );
}
