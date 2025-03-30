import { SVGProps } from "react";

export default function RightArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 10"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M1 5h12m0 0L9 1m4 4L9 9"
      />
    </svg>
  );
}
