export default function ActionButton({
  label,
  disabled = false,
}: {
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="w-full rounded-[92px] bg-dark-1000 p-3.5 text-lg font-bold text-dark-00 md:p-2.5 lg:p-4 lg:text-xl"
      disabled={disabled}
    >
      {label}
    </button>
  );
}
