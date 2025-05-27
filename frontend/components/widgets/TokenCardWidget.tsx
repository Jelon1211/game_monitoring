"use client";
import { useState } from "react";
import { ClipboardIcon, SuccessIcon } from "../icons";
import { JwtToken } from "@/types/jwt";
import { LocaleDate } from "../utils/LocaleDate";

export default function TokenCardWidget({ token }: { token: JwtToken }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token.token);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-5">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Your token details
      </h2>

      <div className="relative flex flex-col bg-gray-50 dark:bg-gray-700 dark:border-gray-600 p-4 rounded-lg border border-gray-200">
        <div className="flex leading-loose justify-between">
          <span className="text-gray-500 dark:text-gray-400">Platform:</span>
          <span className="text-gray-900 dark:text-white">
            {token.platform}
          </span>
        </div>
        <div className="flex leading-loose justify-between">
          <span className="text-gray-500 dark:text-gray-400">Name:</span>
          <span className="text-gray-900 dark:text-white">{token.name}</span>
        </div>
        <div className="flex leading-loose justify-between">
          <span className="text-gray-500 dark:text-gray-400">Description:</span>
          <span className="text-gray-900 dark:text-white text-right">
            {token.description}
          </span>
        </div>
        <div className="flex leading-loose justify-between">
          <span className="text-gray-500 dark:text-gray-400">Expiry:</span>
          <LocaleDate date={token.expire_at} />
        </div>
        <div className="flex leading-loose justify-between">
          <span className="text-gray-500 dark:text-gray-400">Token:</span>
          <span className="text-gray-900 dark:text-white max-w-xs truncate">
            {token.token}
          </span>
        </div>
        {/* <span>Name</span>
          <span>Platform</span>
          <span>Description</span>
          <span>Expiry date</span>
          <span>Token</span>
        </div>
        <div className="flex flex-col space-y-2 text-gray-900 dark:text-white font-medium leading-loose w-[50%]">
          <span></span>
          <span>{token.platform}</span>
          <span>{token.description}</span>
          <LocaleDate date={token.expire_at} />
          <span className=" max-w-xs truncate">{token.token}</span> */}
        <button
          onClick={handleCopy}
          className="absolute -end-1 bottom-5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center group"
        >
          {copied ? <SuccessIcon /> : <ClipboardIcon />}
          <span
            className={`absolute ${
              copied ? "-top-8" : "-top-12"
            } mt-1 text-xs bg-gray-800 text-white px-2 py-1 rounded invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-[visibility] duration-200`}
          >
            {copied ? "Copied!" : "Copy to clipboard"}
          </span>
        </button>
      </div>
    </div>
  );
}
