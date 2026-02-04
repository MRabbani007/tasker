import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { isWeekend } from "@/lib/calendar";
import { Task } from "../../../generated/prisma/client";
import { cn } from "@/lib/utils";

export function WeekView({
  date,
  tasks,
  onDayClick,
}: {
  date: Date;
  tasks: Task[];
  onDayClick: (date: Date) => void;
}) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="flex-1 bg-slate-50/50 p-6 min-h-full">
      <div className="grid grid-cols-7 gap-4 h-full">
        {days.map((day) => {
          const dayTasks = tasks.filter((t) =>
            isSameDay(new Date(t?.dueAt ?? ""), day),
          );
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day?.toISOString()}
              className="flex flex-col gap-3 min-w-37.5"
            >
              {/* Day Header - Glassmorphic Pill */}
              <button
                onClick={() => onDayClick(day)}
                className={cn(
                  "sticky top-0 z-10 flex flex-col items-center py-3 rounded-2xl border transition-all duration-200",
                  isToday
                    ? "bg-white border-indigo-200 shadow-md shadow-indigo-100/50"
                    : "bg-white/40 backdrop-blur-md border-white/60 hover:bg-white/80 hover:border-slate-200 shadow-sm",
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mb-1",
                    isToday ? "text-indigo-600" : "text-slate-400",
                  )}
                >
                  {format(day, "EEE")}
                </span>
                <span
                  className={cn(
                    "text-lg font-bold tracking-tight",
                    isToday ? "text-slate-900" : "text-slate-700",
                  )}
                >
                  {format(day, "d")}
                </span>
                {isToday && (
                  <div className="mt-1 h-1 w-1 rounded-full bg-indigo-600" />
                )}
              </button>

              {/* Task List Container */}
              <div className="flex-1 space-y-3">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "group relative rounded-xl border p-3 transition-all duration-200",
                      "bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-200",
                      isWeekend(day) && "opacity-75 grayscale-[0.2]",
                    )}
                  >
                    {/* Sidebar Match: Indigo accent line on hover */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-1 bg-indigo-600 rounded-r-full transition-all group-hover:h-2/3" />

                    <h3 className="text-sm font-medium text-slate-700 leading-snug group-hover:text-slate-900 transition-colors">
                      {task.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/40" />
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {format(new Date(task.dueAt || ""), "h:mm a")}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Empty State placeholder for visual consistency */}
                {dayTasks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 flex flex-col items-center justify-center opacity-40">
                    <div className="h-1 w-8 bg-slate-200 rounded-full" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
