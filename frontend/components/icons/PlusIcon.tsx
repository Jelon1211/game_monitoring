import { SVGProps } from "react";

export default function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <p className="text-2xl text-gray-400 dark:text-gray-500">
      <svg
        className="w-3.5 h-3.5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 18 18"
        {...props}
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 1v16M1 9h16"
        />
      </svg>
    </p>
  );
}
