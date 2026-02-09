"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  formatDateToParam,
  parseParamToDate,
  toInputDateValue,
} from "@/lib/format/date";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function DateSelector({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dayParam = searchParams.get("day");

  const date = useMemo(() => parseParamToDate(dayParam), [dayParam]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = new Date(e.target.value);
    const formatted = formatDateToParam(selectedDate);

    const params = new URLSearchParams(searchParams.toString());
    params.set("day", formatted);

    router.replace(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Visible text */}
      <span
        className={cn(
          "pointer-events-none text-sm font-medium text-indigo-700/70",
          "group-hover:text-indigo-900 transition-colors",
        )}
      >
        {date.toDateString()}
      </span>

      {/* Invisible date input */}
      <input
        type="date"
        value={toInputDateValue(date)}
        onChange={onChange}
        className={cn(
          "absolute inset-0 opacity-0 cursor-pointer",
          "hover:opacity-5 focus:opacity-5",
        )}
      />
    </div>
  );
}
