export default function VerifiedIcon({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.2832 11.3828C17.5436 10.9489 17.8091 10.5066 17.8091 9.99935C17.8091 9.49062 17.5482 9.05332 17.2881 8.6173C17.1221 8.33909 16.9564 8.0614 16.859 7.76601C16.7596 7.46425 16.7274 7.13082 16.6953 6.79827C16.6467 6.29512 16.5983 5.79401 16.3174 5.40768C16.0325 5.01597 15.552 4.80748 15.0786 4.60212C14.7766 4.47108 14.4775 4.34131 14.234 4.16601C13.9878 3.98873 13.77 3.7403 13.5507 3.49003C13.2132 3.10507 12.8719 2.71575 12.4174 2.57435C11.9683 2.43462 11.4803 2.54293 10.9874 2.65231C10.6573 2.72559 10.325 2.79935 10.0007 2.79935C9.67874 2.79935 9.34883 2.72398 9.021 2.64909C8.52579 2.53597 8.03531 2.42393 7.58405 2.57435C7.13177 2.72511 6.79768 3.10315 6.46299 3.48187C6.24268 3.73117 6.0221 3.98076 5.76738 4.16601C5.51192 4.35181 5.20229 4.48741 4.8932 4.62277C4.42594 4.82741 3.95991 5.03151 3.68405 5.40768C3.4037 5.78997 3.35095 6.31256 3.29887 6.82861C3.2658 7.15624 3.23299 7.48124 3.14238 7.76601C3.05124 8.05246 2.88636 8.32873 2.71924 8.60874C2.45853 9.04558 2.19238 9.49152 2.19238 9.99935C2.19238 10.5081 2.45326 10.9454 2.71338 11.3814C2.87934 11.6596 3.045 11.9373 3.14238 12.2327C3.24118 12.5324 3.271 12.8633 3.30076 13.1935C3.34631 13.699 3.39172 14.2029 3.68405 14.591C3.97576 14.9783 4.44657 15.1834 4.91143 15.386C5.2168 15.519 5.5196 15.651 5.76738 15.8327C6.01173 16.0119 6.22805 16.2598 6.44573 16.5093C6.78485 16.8981 7.12726 17.2906 7.58405 17.4327C8.03023 17.5715 8.50591 17.4655 8.99353 17.3569C9.32557 17.2829 9.66314 17.2077 10.0007 17.2077C10.3346 17.2077 10.6685 17.2826 10.9971 17.3563C11.4885 17.4666 11.9679 17.5742 12.4174 17.4243C12.8659 17.2748 13.1982 16.8958 13.5301 16.5173C13.7532 16.2628 13.9761 16.0086 14.234 15.8243C14.4858 15.6446 14.79 15.5109 15.0946 15.3772C15.5664 15.17 16.0388 14.9625 16.3174 14.5827C16.5977 14.2004 16.6505 13.6778 16.7026 13.1617C16.7356 12.8341 16.7684 12.5091 16.859 12.2243C16.9504 11.9374 17.1157 11.6618 17.2832 11.3828ZM13.8637 8.86368C14.1566 8.57079 14.1566 8.09592 13.8637 7.80302C13.5708 7.51013 13.0959 7.51013 12.803 7.80302L9.16667 11.4394L7.197 9.46969C6.9041 9.1768 6.42923 9.1768 6.13634 9.46969C5.84344 9.76258 5.84344 10.2375 6.13634 10.5304L8.63634 13.0304C8.77699 13.171 8.96775 13.25 9.16667 13.25C9.36558 13.25 9.55634 13.171 9.697 13.0304L13.8637 8.86368Z"
        fill="#0CC72C"
      />
    </svg>
  );
}