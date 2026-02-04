import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Task } from "../../../generated/prisma/client";
import { getMonthDays, isWeekend } from "@/lib/calendar";

export function MonthView({
  date,
  tasks,
  onDayClick,
}: {
  date: Date;
  tasks: Task[];
  onDayClick: (date: Date) => void;
}) {
  const days = getMonthDays(date);

  return (
    <div className="w-full rounded-2xl border border-white/60 bg-white/30 backdrop-blur-md overflow-hidden shadow-sm">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-slate-200/60 bg-slate-50/50">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-center"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-px bg-slate-200/40">
        {days.map((day) => {
          const dayTasks = tasks.filter((t) =>
            isSameDay(new Date(t?.dueAt ?? ""), day),
          );

          const importantCount = dayTasks.filter(
            (t) => t.priority > 3 && !t.completed,
          ).length;
          const openCount = dayTasks.filter((t) => !t.completed).length;
          const isCurrentMonth = isSameMonth(day, date);
          const isCurrentDay = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={cn(
                "min-h-27.5 p-3 text-left transition-all duration-200 group relative",
                isCurrentMonth ? "bg-white/80" : "bg-slate-50/40 opacity-40",
                isWeekend(day) && isCurrentMonth && "bg-slate-50/60",
                "hover:bg-white hover:z-10 hover:shadow-[0_0_20px_rgba(0,0,0,0.05)]",
              )}
            >
              {/* Day Number */}
              <div className="flex justify-between items-start mb-2">
                <span
                  className={cn(
                    "text-xs font-bold px-1.5 py-0.5 rounded-md transition-colors",
                    isCurrentDay
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "text-slate-500 group-hover:text-indigo-600",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Task Indicators */}
              <div className="space-y-1.5">
                {importantCount > 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-50 border border-rose-100">
                    <div className="h-1 w-1 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-tight">
                      {importantCount} Priority
                    </span>
                  </div>
                )}

                {openCount > 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-100">
                    <div className="h-1 w-1 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">
                      {openCount} Tasks
                    </span>
                  </div>
                )}
              </div>

              {/* Subtle hover effect bar matching the sidebar */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 transition-all group-hover:w-full" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
