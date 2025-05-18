"use client";
import { useEffect, useState } from "react";

export function LocaleDate({ date }: { date: Date | string }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    const locale = navigator.language || "pl-PL";
    setFormatted(
      new Date(date).toLocaleDateString(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    );
  }, [date]);

  return <span>{formatted || "—"}</span>;
}
