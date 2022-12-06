export default function ActionButton({
  label,
  disabled = false,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="w-full rounded-[92px] bg-dark-1000 text-lg font-bold text-dark-100 p-3.5 md:px-2.5 lg:py-4 lg:px-8 xl:px-14 lg:text-xl lg:leading-8 disabled:opacity-30 disabled:pointer-events-none hover:dark-cta-hover active:dark-cta-pressed"
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
