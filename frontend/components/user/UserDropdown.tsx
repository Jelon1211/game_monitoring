"use client";
import { RefObject } from "react";
import { useUser } from "@/context/user-context";
import { handleSignOut } from "@/lib/actions/signOut";
import { appRoutes } from "@/config/routes";
import Link from "next/link";
import { RouteGroup } from "@/enums/routes";

export default function UserDropdown({
  dropdownRef,
  setOpen,
}: {
  dropdownRef: RefObject<HTMLDivElement | null>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useUser();

  const userRoutes = appRoutes.filter((route) =>
    route.group.includes(RouteGroup.USER)
  );

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 z-50 w-48 bg-white divide-y divide-gray-100 rounded-md shadow-md dark:bg-gray-700 dark:divide-gray-600"
    >
      <div className="px-4 py-3">
        <p className="text-sm text-gray-900 dark:text-white">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
          {user?.email}
        </p>
      </div>
      <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
        {userRoutes.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              {route.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={handleSignOut}
            className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
          >
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
}
