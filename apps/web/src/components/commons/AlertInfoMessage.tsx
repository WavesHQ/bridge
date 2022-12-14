import clsx from "clsx";
import { FiAlertTriangle } from "react-icons/fi";

export default function AlertInfoMessage({
  message,
  containerStyle,
  textStyle,
}: {
  message: string;
  containerStyle?: string;
  textStyle?: string;
}) {
  return (
    <div
      className={clsx(
        "flex items-center border border-warning rounded-lg",
        containerStyle
      )}
    >
      <FiAlertTriangle size={24} className="shrink-0 text-warning" />
      <span className={clsx("text-left text-warning ml-3", textStyle)}>
        {message}
      </span>
    </div>
  );
}
