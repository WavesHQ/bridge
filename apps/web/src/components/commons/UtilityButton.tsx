import clsx from "clsx";
import { RiLoader2Line } from "react-icons/ri";
import { FiArrowRight } from "react-icons/fi";

export default function UtilityButton({
  label,
  onClick,
  disabled = false,
  isLoading = false,
  withArrowIcon = false,
  variant = "primary",
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  withArrowIcon?: boolean;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";
  return (
    <button
      type="button"
      className={clsx(
        "w-full flex items-center justify-center rounded-[32px] font-bold focus-visible:outline-none",
        "md:w-auto md:font-semibold",
        isPrimary
          ? "bg-dark-1000 text-lg text-dark-100 p-3.5 md:text-sm md:px-5 md:py-2.5 hover:dark-cta-hover active:dark-cta-pressed"
          : "bg-transparent border border-dark-1000 text-sm text-dark-1000 px-4 py-2 hover:border-brand-100 active:opacity-70",
        {
          "dark-cta-pressed": isLoading,
          "pointer-events-none opacity-30": disabled || isLoading,
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
      {isLoading && (
        <RiLoader2Line
          size={16}
          className={clsx("inline-block animate-spin text-dark-100 ml-1")}
        />
      )}
      {withArrowIcon && !isLoading && (
        <FiArrowRight
          size={16}
          className="inline-block  text-dark-100 ml-0.5"
        />
      )}
    </button>
  );
}
