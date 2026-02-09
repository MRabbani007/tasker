"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDateToParam, parseDayParam, isSameDay } from "@/lib/format/date";
import { cn } from "@/lib/utils";

export function JournalDayNavigator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dayParam = searchParams.get("day");
  const currentDate = parseDayParam(dayParam);
  const today = new Date();

  const isToday = isSameDay(currentDate, today);

  function updateDate(date: Date) {
    const params = new URLSearchParams(searchParams.toString());

    // If navigating to today, keep URL clean
    if (isSameDay(date, today)) {
      params.delete("day");
    } else {
      params.set("day", formatDateToParam(date));
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function goPrev() {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    updateDate(prev);
  }

  function goNext() {
    if (isToday) return;

    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    updateDate(next);
  }

  function goToday() {
    updateDate(today);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={goPrev}
        className="rounded-lg p-2 text-indigo-700 hover:bg-indigo-100 transition"
        aria-label="Previous day"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={goToday}
        className={cn(
          "text-sm font-medium px-3 py-1.5 rounded-lg transition",
          isToday
            ? "text-indigo-900 bg-indigo-100"
            : "text-indigo-700 hover:bg-indigo-100",
        )}
      >
        {currentDate.toDateString()}
      </button>

      <button
        onClick={goNext}
        disabled={isToday}
        className={cn(
          "rounded-lg p-2 transition",
          isToday
            ? "text-indigo-300 cursor-not-allowed"
            : "text-indigo-700 hover:bg-indigo-100",
        )}
        aria-label="Next day"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
