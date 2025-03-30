"use client";

import { ModalHeaderType } from "@/types/components";

export default function ModalHeader({ title }: ModalHeaderType) {
  return (
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      {title}
    </h3>
  );
}
