import clsx from "clsx";
import { FiAlertTriangle } from "react-icons/fi";

export default function AlertInfoMessage({ message }: { message: string }) {
  return (
    <div
      className={clsx(
        "flex items-center border border-warning rounded-lg px-4 py-3 mb-8",
        "md:px-6 md:py-4 md:mb-12"
      )}
    >
      <FiAlertTriangle size={24} className="shrink-0 text-warning" />
      <span className="ml-3 text-warning">{message}</span>
    </div>
  );
}
