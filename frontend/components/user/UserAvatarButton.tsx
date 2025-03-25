"use client";
import Image from "next/image";
import { RefObject } from "react";
import { useUser } from "@/context/user-context";

export default function UserAvatarButton({
  onClick,
  buttonRef,
}: {
  onClick: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const { user } = useUser();

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 cursor-pointer"
    >
      <span className="sr-only">Open user menu</span>
      <Image
        src={user?.profilePictureUrl ?? "/globe.svg"}
        width={30}
        height={30}
        alt="user photo"
        className="rounded-full"
      />
    </button>
  );
}
