"use client";

import {
  CheckCircle2,
  Circle,
  Link as LinkIcon,
  MoreVertical,
  Hash,
  Clock,
  ListChecks,
  Loader,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Task } from "../../../generated/prisma/client";
import UserFormTrigger from "@/components/UserFormTrigger";
import { getDueInfo } from "@/lib/helpers";
import { useDebounce } from "@/hooks/useDebounce";
import { toggleTaskCompleted } from "@/lib/actions/user/tasks";

// More professional priority map using Slate/Indigo variants
const priorityConfig: Record<number, { color: string; label: string }> = {
  1: { color: "bg-slate-200", label: "Low" },
  2: { color: "bg-emerald-500", label: "Normal" },
  3: { color: "bg-amber-500", label: "Medium" },
  4: { color: "bg-orange-500", label: "High" },
  5: { color: "bg-rose-500", label: "Urgent" },
};

const FLAG_COLORS = [
  { value: null, label: "No flag", className: "bg-slate-200" },
  { value: "bg-blue-500", label: "Blue", className: "bg-blue-500" },
  { value: "bg-green-500", label: "Green", className: "bg-green-500" },
  { value: "bg-yellow-500", label: "Yellow", className: "bg-yellow-500" },
  { value: "bg-orange-500", label: "Orange", className: "bg-orange-500" },
  { value: "bg-red-500", label: "Red", className: "bg-red-500" },
  { value: "bg-purple-500", label: "Purple", className: "bg-purple-500" },
];

export default function CardTask({
  task,
}: {
  task: Task & { taskList: { title: string | null } | null };
}) {
  const [completed, setCompleted] = useState(task.completed);
  const [saving, setSaving] = useState(false);

  // Priority config as defined before
  const priority = priorityConfig[task.priority] || priorityConfig[1];
  const dueInfo = getDueInfo(
    task.dueOn?.toISOString().split("T")[0],
    task.dueAt?.toISOString().split("T")[1],
  );

  const debouncedCompleted = useDebounce(completed, 1000);

  const hasList = !!task?.taskList;

  const flagColor =
    FLAG_COLORS.find((item) => item.value === task.color)?.className ?? "";

  useEffect(() => {
    const handleUpdate = async () => {
      setSaving(true);

      const formData = new FormData();
      formData.append("id", task.id);
      formData.append("completed", String(debouncedCompleted));
      formData.append("completedAt", String(new Date()));

      await toggleTaskCompleted(formData);

      setSaving(false);
    };

    if (debouncedCompleted !== task.completed) {
      handleUpdate();
    }
  }, [debouncedCompleted]);

  return (
    <div
      className={cn(
        "flex-1 group relative flex flex-col rounded-2xl border bg-white dark:bg-zinc-800 transition-all duration-300",
        "hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-slate-500/40",
        completed
          ? "border-slate-100 bg-slate-50/50"
          : "border-slate-200 dark:border-slate-600 shadow-sm",
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-all",
          flagColor,
        )}
      />

      <div className="flex items-center gap-4 px-4 pt-3 ">
        {/* 1. Optional Title as a "Topic Badge" at the very top */}
        {task.title && (
          <div className="flex-1 flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100/50 max-w-[80%]">
              <Hash className="h-3 w-3 text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase truncate">
                {task.title}
              </span>
            </div>
          </div>
        )}

        <UserFormTrigger
          type="container"
          value="MOVE_TASK"
          editItem={{ type: "task", data: task }}
          className="flex items-center gap-2 px-2 py-0.5 ml-auto rounded-md bg-indigo-50 border border-indigo-100/50 max-w-[80%] overflow-clip"
        >
          <ListChecks size={16} className="text-indigo-400" />
          {hasList ? (
            <span className="text-[10px] font-bold text-indigo-600 uppercase truncate">
              {task.taskList?.title}
            </span>
          ) : (
            <span className="text-[10px] text-zinc-600 invisible group-hover:visible opacity-0 group-hover:opacity-100 duration-200 w-0 group-hover:w-12 text-nowrap">
              Move to list
            </span>
          )}
        </UserFormTrigger>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* 2. Main Task Area: Toggle + Content */}
        <div className="flex-1 flex items-start gap-3">
          <button
            onClick={() => setCompleted(!completed)}
            className={cn(
              "mt-0.5 shrink-0 transition-all duration-200 hover:scale-110",
              completed
                ? "text-emerald-500"
                : "text-slate-300 hover:text-indigo-500",
            )}
          >
            {completed ? (
              <CheckCircle2
                size={22}
                fill="currentColor"
                className="text-emerald-500 fill-emerald-50/50"
              />
            ) : (
              <Circle size={22} />
            )}
          </button>
          <UserFormTrigger
            type="container"
            value="EDIT_TASK"
            editItem={{ type: "task", data: task }}
            className="flex-1 min-w-0 pt-0.5"
          >
            <p
              className={cn(
                "text-base font-semibold leading-snug text-slate-800 dark:text-slate-100 cursor-pointer transition-colors",
                completed && "line-through text-slate-400",
              )}
            >
              {task.task || "New Task..."}
            </p>

            {/* 3. Details shown directly under the main task */}
            {task.details && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {task.details}
              </p>
            )}
          </UserFormTrigger>
        </div>

        {/* 4. Metadata Footer */}
        <div className="flex items-center justify-between mt-1 pl-9">
          <div className="flex items-center gap-4">
            {/* Priority Indicator */}
            <div className="flex items-center gap-1.5">
              <div className={cn("w-2 h-2 rounded-full", priority.color)} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                {priority.label}
              </span>
            </div>

            {/* Due Date Info */}
            {dueInfo && (
              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-bold uppercase",
                  task.priority >= 4 && !completed
                    ? "text-rose-500"
                    : "text-slate-400",
                )}
              >
                <Clock size={12} />
                <span>{dueInfo.message}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {task.link && (
              <a
                href={task.link}
                target="_blank"
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <LinkIcon size={14} />
              </a>
            )}
            <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
              <MoreVertical size={14} />
            </button>
          </div>

          {saving ? (
            <Loader size={15} className="animate-spin" />
          ) : (
            <Check size={15} />
          )}
        </div>
      </div>
    </div>
  );
}
