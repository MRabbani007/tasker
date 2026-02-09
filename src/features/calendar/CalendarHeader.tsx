"use client";

import { addDays, addMonths, addWeeks, format } from "date-fns";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { CalendarFilters, CalendarView } from "./Calendar";
import { cn } from "@/lib/utils";

interface Props {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  date: Date;
  setDate: (date: Date) => void;
  filters: CalendarFilters;
  setFilters: (filters: CalendarFilters) => void;
}

export function CalendarHeader({
  view,
  setView,
  date,
  setDate,
  filters,
  setFilters,
}: Props) {
  const goPrev = () => {
    if (view === "month") setDate(addMonths(date, -1));
    if (view === "week") setDate(addWeeks(date, -1));
    if (view === "day") setDate(addDays(date, -1));
  };

  const goNext = () => {
    if (view === "month") setDate(addMonths(date, 1));
    if (view === "week") setDate(addWeeks(date, 1));
    if (view === "day") setDate(addDays(date, 1));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md shadow-sm">
      {/* Left Section: Navigation */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <button onClick={goPrev} className={navBtnStyles}>
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setDate(new Date())}
            className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Today
          </button>
          <button onClick={goNext} className={navBtnStyles}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex flex-col ml-2">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
            {view === "month" && format(date, "MMMM yyyy")}
            {view === "week" && `Week of ${format(date, "MMM d")}`}
            {view === "day" && format(date, "EEEE, MMM d")}
          </h2>
          <span className="text-[10px] font-medium text-indigo-500 uppercase tracking-widest mt-1">
            {view} view
          </span>
        </div>
      </div>

      {/* Right Section: Controls */}
      <div className="flex items-center gap-3">
        {/* View Toggle - Segmented Control */}
        <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200">
          {(["day", "week", "month"] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize",
                view === v
                  ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Filters Button */}
        <button
          onClick={() =>
            setFilters({ ...filters, showCompleted: !filters.showCompleted })
          }
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all",
            filters.showCompleted
              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
              : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 shadow-sm",
          )}
        >
          <Filter
            size={14}
            className={
              filters.showCompleted ? "text-indigo-100" : "text-slate-400"
            }
          />
          {filters.showCompleted ? "Showing Done" : "Hide Done"}
        </button>
      </div>
    </div>
  );
}

const navBtnStyles =
  "p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all";
