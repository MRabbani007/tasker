import { format, isSameDay, setHours } from "date-fns";
import { Task } from "../../../generated/prisma/client";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface Props {
  date: Date;
  tasks: Task[];
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function DayView({ date, tasks }: Props) {
  const dayTasks = tasks.filter((t) =>
    isSameDay(new Date(t.dueAt ?? ""), date),
  );

  return (
    <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md overflow-hidden shadow-sm">
      {/* Day Header */}
      <div className="p-4 border-b border-slate-200/60 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-100">
            <Clock size={16} />
          </div>
          <h3 className="font-bold text-slate-800 tracking-tight">
            Schedule for {format(date, "MMMM do")}
          </h3>
        </div>
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">
          {dayTasks.length} {dayTasks.length === 1 ? "Task" : "Tasks"}
        </span>
      </div>

      {/* Timeline */}
      <div className="divide-y divide-slate-100">
        {HOURS.map((hour) => {
          const hourTasks = dayTasks.filter((t) => {
            const d = new Date(t.dueAt ?? "");
            return d.getHours() === hour;
          });

          const isCurrentHour =
            new Date().getHours() === hour && isSameDay(date, new Date());

          return (
            <div
              key={hour}
              className="group flex min-h-20 hover:bg-slate-50/30 transition-colors"
            >
              {/* Time Label */}
              <div className="w-20 shrink-0 py-4 px-3 text-right border-r border-slate-100 relative">
                <span
                  className={cn(
                    "text-xs font-bold tracking-tighter transition-colors",
                    isCurrentHour
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-slate-600",
                  )}
                >
                  {format(setHours(new Date(), hour), "h aa")}
                </span>
                {isCurrentHour && (
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                )}
              </div>

              {/* Task Slot */}
              <div className="flex-1 p-3 gap-2 flex flex-col justify-center">
                {hourTasks.length > 0 ? (
                  hourTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "group/task relative overflow-hidden rounded-xl border p-3 transition-all duration-200",
                        "bg-white border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5",
                        task.completed && "opacity-60 bg-slate-50",
                      )}
                    >
                      {/* Sidebar matching accent bar */}
                      <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 opacity-20 group-hover/task:opacity-100 transition-opacity" />

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-semibold tracking-tight",
                            task.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-700",
                          )}
                        >
                          {task.title}
                        </span>
                        <span
                          className={cn(
                            "text-sm tracking-tight",
                            task.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-700",
                          )}
                        >
                          {task.task}
                        </span>
                        {task.priority > 3 && (
                          <span className="ml-auto text-[9px] font-black text-rose-500 uppercase px-1.5 py-0.5 rounded bg-rose-50">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full w-full rounded-lg border border-dashed border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity flex items-center px-4">
                    <span className="text-[10px] font-medium text-slate-300 uppercase tracking-widest">
                      Free Slot
                    </span>
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
