"use client";

import { getDueDateStatement } from "@/lib/dateFunctions";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { LuBellRing } from "react-icons/lu";
import { Task } from "../../../generated/prisma/client";
import { useDebounce } from "@/hooks/useDebounce";
import { toggleTaskCompleted } from "@/lib/actions/user/tasks";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import clsx from "clsx";
import { cn } from "@/lib/utils";

const priorityColor: Record<number, string> = {
  1: "#0284c7",
  2: "#16a34a",
  3: "#eab308",
  4: "#f97316",
  5: "#dc2626",
};

const bgMap: Record<string, string> = {
  "bg-red-600": "bg-red-100",
  "bg-sky-600": "bg-sky-100",
  "bg-green-600": "bg-green-100",
  "bg-yellow-500": "bg-yellow-100",
  "bg-orange-600": "bg-orange-100",
  "bg-zinc-600": "bg-zinc-100",
};

export default function CardTask({ task }: { task: Task }) {
  const { setShowForm, setEditItem } = useUser();

  const [completed, setCompleted] = useState(task.completed);
  const debouncedCompleted = useDebounce(completed, 600);
  const mounted = useRef(false);

  /** ---------------- Completion Sync ---------------- */
  useEffect(() => {
    const ToggleCompleted = async () => {
      try {
        console.log("clicked");
        if (!mounted.current || debouncedCompleted === task.completed) return;

        const formData = new FormData();
        formData.append("id", String(task.id));
        formData.append("completed", String(debouncedCompleted));
        formData.append(
          "completedAt",
          String(debouncedCompleted ? new Date() : null),
        );

        const res = await toggleTaskCompleted(formData);

        console.log(res);
        if (res.status === 200) {
          toast.success("Task saved");
        }
      } catch {
        toast.error("Failed to update task");
      }
    };

    ToggleCompleted();
  }, [debouncedCompleted]);

  useEffect(() => {
    mounted.current = true;
  }, []);

  useEffect(() => {
    const temp = () => {
      setCompleted(task.completed);
    };

    temp();
  }, [task.completed]);

  /** ---------------- Dates ---------------- */
  const dueDate = task.dueOn ? new Date(task.dueOn) : null;
  const dueInfo = dueDate ? getDueDateStatement(dueDate) : null;

  const bgClass = bgMap[task.color ?? ""] ?? "bg-zinc-100";
  const priorityDot = priorityColor[task.priority] ?? "#0284c7";

  const openEdit = () => {
    setShowForm("EDIT_TASK");
    setEditItem({ type: "task", data: task });
  };

  return (
    <div
      onClick={() => console.log(task)}
      className="relative flex flex-col rounded-2xl overflow-hidden group bg-white shadow-sm hover:shadow-md transition"
    >
      {/* Header */}
      <div className={clsx("flex items-center gap-3 p-4", bgClass)}>
        {/* Checkbox */}
        <label className="relative flex items-center">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => setCompleted((v) => !v)}
            className="sr-only"
          />
          <span className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
            <span
              className={cn(
                "w-3 h-3 rounded-full bg-blue-500 scale-0 transition",
                completed ? "scale-100" : "scale-0",
              )}
            />
          </span>
        </label>

        {/* Title */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={openEdit}>
          <p className="font-semibold truncate text-zinc-900">
            {task.title || "Untitled task"}
          </p>
          {dueInfo && (
            <p className="text-xs text-zinc-600">{dueInfo.message}</p>
          )}
        </div>

        <LuBellRing className="text-zinc-600" />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4">
        {task.task && (
          <p
            onClick={openEdit}
            className="text-sm text-zinc-800 line-clamp-2 cursor-pointer"
          >
            {task.task}
          </p>
        )}

        {task.details && (
          <p className="text-xs text-zinc-600 line-clamp-3">{task.details}</p>
        )}

        {task.notes && (
          <p className="text-xs text-cyan-800 line-clamp-2">{task.notes}</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-4 pb-4 mt-auto">
        {/* Priority */}
        <div className="flex items-center gap-1 text-xs">
          <span
            style={{ backgroundColor: priorityDot }}
            className={clsx(
              "w-3 h-3 rounded-full",
              task.priority >= 4 && "animate-pulse",
            )}
          />
          <span>{task.priority}</span>
        </div>

        <div className="flex-1" />

        {task.link && (
          <Link
            href={task.link}
            target="_blank"
            className="text-xs text-blue-600 hover:underline truncate max-w-30"
          >
            {task.linkText ?? task.link}
          </Link>
        )}
      </div>
    </div>
  );
}
