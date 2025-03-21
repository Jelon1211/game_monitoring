"use client";

import { useEffect, useRef, useState } from "react";
import UserMenu from "./UserMenu";
import Image from "next/image";
import { OpenSidebar, CloseSidebar } from "@/components/icons";
import { appRoutes } from "@/config/routes";
import { RouteGroup } from "@/enums/routes";
import Link from "next/link";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const userRoutes = appRoutes.filter((route) =>
    route.group.includes(RouteGroup.SIDEBAR)
  );

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                ref={buttonRef}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                {sidebarOpen ? <CloseSidebar /> : <OpenSidebar />}
              </button>
              <Image
                src="/logo.png"
                width={40}
                height={40}
                alt="FlowBite Logo"
                className="me-3"
              />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Game Monitoring
              </span>
            </div>
            <div className="flex items-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {userRoutes.map((route) => (
              <li key={route.href} className="flex justify-start items-center">
                {route.icon && <route.icon />}
                <Link
                  href={route.href}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
          <div
            id="dropdown-cta"
            className="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900"
            role="alert"
          >
            <div className="flex items-center mb-3">
              <span className="bg-orange-100 text-orange-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-orange-200 dark:text-orange-900">
                Beta
              </span>
            </div>
            <p className="mb-3 text-sm text-blue-800 dark:text-blue-400">
              Preview the new gamemonitoring dashboard navigation! You can use
              the new app off for a limited time now.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
