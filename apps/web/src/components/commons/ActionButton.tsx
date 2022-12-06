import clsx from "clsx";
import { RiLoader2Line } from "react-icons/ri";

export default function ActionButton({
  label,
  onClick,
  disabled = false,
  isLoading = false,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  return (
    <button
      type="button"
      className={clsx(
        `w-full rounded-[92px] bg-dark-1000 text-lg font-bold text-dark-100 p-3.5 md:px-2.5 lg:py-4 lg:px-8 xl:px-14 lg:text-xl lg:leading-8
        hover:dark-cta-hover active:dark-cta-pressed disabled:opacity-30`,
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
          className="inline-block animate-spin text-dark-100"
        />
      )}
    </button>
  );
}
