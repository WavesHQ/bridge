import QRCode from "react-qr-code";
import ActionButton from "@components/commons/ActionButton";
import clsx from "clsx";
import useResponsive from "@hooks/useResponsive";
import TimeLimitCounter from "./TimeLimitCounter";

const dfcUniqueAddress = "df1qdnru4kgysjl088man5vfmsm6wukc2refhurctf"; // TODO: Replace with real data

function ConfirmButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <ActionButton label="Confirm send" onClick={onConfirm} variant="utility" />
  );
}

export default function StepOneSendConfirmation({
  goToNextStep,
}: {
  goToNextStep: () => void;
}) {
  const { isMobile } = useResponsive();

  const handleConfirmClick = () => {
    goToNextStep();
  };

  return (
    <div className={clsx("flex flex-col gap-7 mt-6", "md:flex-row md:mt-4")}>
      <div
        className={clsx(
          "w-full flex flex-row gap-4 order-1",
          "md:w-2/5 md:flex-col md:shrink-0 md:gap-3 md:order-none md:border-[0.5px] border-dark-200 rounded md:px-5 md:pt-4 md:pb-3"
        )}
      >
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
          <div
            className={clsx(
              "text-sm text-dark-900 text-left break-all mt-1",
              "md:text-xs md:text-center"
            )}
          >
            {dfcUniqueAddress}
          </div>
          {isMobile && <TimeLimitCounter />}
        </div>
      </div>
      <div className="flex flex-col justify-center grow">
        <span className="font-semibold tracking-wider text-dark-900">
          Transfer DFC tokens
        </span>
        <p className={clsx("text-sm text-dark-700 mt-1", "md:mt-2")}>
          Send your DFC tokens to the unique DFC address to start the withdrawal
          process. This address is only valid for 30 minutes.
        </p>
        {!isMobile && <TimeLimitCounter />}
        {/* Web confirm button */}
        <div className={clsx("hidden mt-12", "md:block")}>
          <ConfirmButton onConfirm={handleConfirmClick} />
        </div>
      </div>

      {/* Mobile confirm button */}
      <div className={clsx("order-last px-6 pt-5", "md:hidden md:px-0")}>
        <ConfirmButton onConfirm={handleConfirmClick} />
      </div>
    </div>
  );
}
