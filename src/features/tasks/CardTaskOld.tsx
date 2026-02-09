"use client";

import {
  CheckCircle2,
  Circle,
  Link as LinkIcon,
  Bell,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "../../../generated/prisma/client";
import { useState } from "react";

// More professional priority map using Slate/Indigo variants
const priorityConfig: Record<number, { color: string; label: string }> = {
  1: { color: "bg-slate-200", label: "Low" },
  2: { color: "bg-emerald-500", label: "Normal" },
  3: { color: "bg-amber-500", label: "Medium" },
  4: { color: "bg-orange-500", label: "High" },
  5: { color: "bg-rose-500", label: "Urgent" },
};

export default function CardTaskOld({ task }: { task: Task }) {
  const [completed, setCompleted] = useState(task.completed);

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-white transition-all duration-300",
        "hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1",
        completed ? "border-slate-100 opacity-75" : "border-slate-200",
      )}
    >
      {/* Priority Side-Accent */}
      <div
        className={cn(
          "absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-all",
          priorityConfig[task.priority]?.color,
        )}
      />

      <div className="p-5 flex flex-col gap-4">
        {/* Top Row: Checkbox & Title */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => setCompleted(!completed)}
            className={cn(
              "mt-0.5 shrink-0 transition-colors",
              completed
                ? "text-emerald-500"
                : "text-slate-300 hover:text-indigo-500",
            )}
          >
            {completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-bold text-slate-800 leading-tight truncate cursor-pointer transition-colors hover:text-indigo-600",
                completed && "line-through text-slate-400",
              )}
            >
              {task.title || "Untitled Task"}
            </h3>
            {/* {dueInfo && (
              <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-slate-500">
                <Clock size={12} className={cn(isUrgent && !completed && "text-rose-500")} />
                <span className={cn(isUrgent && !completed && "text-rose-600")}>{dueInfo.message}</span>
              </div>
            )} */}
          </div>

          <button className="text-slate-300 hover:text-slate-600 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Content Section */}
        {(task.task || task.details) && (
          <div className="space-y-2 ml-8">
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed italic">
              {task.task}
            </p>
            {task.details && (
              <p className="text-[12px] text-slate-400 line-clamp-2">
                {task.details}
              </p>
            )}
          </div>
        )}

        {/* Footer: Metadata */}
        <div className="mt-auto ml-8 pt-4 flex items-center justify-between border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100">
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  priorityConfig[task.priority]?.color,
                )}
              />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                {priorityConfig[task.priority]?.label}
              </span>
            </div>

            {task.link && (
              <a
                href={task.link}
                target="_blank"
                className="p-1.5 rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
              >
                <LinkIcon size={14} />
              </a>
            )}
          </div>

          <div className="flex -space-x-2">
            {/* Visual fluff: Placeholder for assigned users or status icons */}
            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
              <Bell size={10} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
