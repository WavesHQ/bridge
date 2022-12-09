import clsx from "clsx";
import { RiLoader2Line } from "react-icons/ri";
import { FiArrowRight } from "react-icons/fi";

export default function ActionButton({
  label,
  onClick,
  disabled = false,
  isLoading = false,
  variant = "cta",
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "cta" | "utility";
}) {
  const isUtilityBtn = variant === "utility";
  return (
    <button
      type="button"
      className={clsx(
        `w-full flex items-center justify-center rounded-[92px] bg-dark-1000 text-lg font-bold text-dark-100 p-3.5
        focus-visible:outline-none hover:dark-cta-hover active:dark-cta-pressed disabled:opacity-30`,
        isUtilityBtn
          ? "md:w-auto md:text-sm md:font-semibold md:px-5 md:py-2.5"
          : "lg:text-xl lg:leading-8 md:px-2.5 lg:py-4 lg:px-8 xl:px-14",
        {
          "dark-cta-pressed": isLoading,
          "pointer-events-none": disabled || isLoading,
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
      {isLoading && (
        <RiLoader2Line
          size={24}
          className="inline-block animate-spin text-dark-100 ml-2"
        />
      )}
      {isUtilityBtn && !isLoading && (
        <FiArrowRight
          size={16}
          className="inline-block  text-dark-100 ml-0.5"
        />
      )}
    </button>
  );
}
