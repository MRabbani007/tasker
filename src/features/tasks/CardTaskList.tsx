"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Pin, Layers } from "lucide-react";
import { TaskList } from "../../../generated/prisma/client";
import UserFormTrigger from "@/components/UserFormTrigger";
import { cn } from "@/lib/utils";

const SUMMARY_PRIORITY = [
  {
    key: "overdue",
    label: "Overdue",
    color: "text-rose-600 bg-rose-50 border-rose-100",
    icon: "Clock",
  },
  {
    key: "dueToday",
    label: "Today",
    color: "text-amber-600 bg-amber-50 border-amber-100",
    icon: "CalendarDays",
  },
  {
    key: "important",
    label: "Important",
    color: "text-orange-600 bg-orange-50 border-orange-100",
    icon: "AlertTriangle",
  },
  {
    key: "open",
    label: "Pending",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    icon: "Circle",
  },
];

export default function TaskListCard({
  taskList,
}: {
  taskList: TaskList & { summary: TaskListSummary };
}) {
  const isPinned = !!taskList.pinnedAt;
  const totalTasks =
    Number(taskList.summary.open || 0) +
    Number(taskList.summary.completed || 0);
  const progress =
    totalTasks > 0
      ? (Number(taskList.summary.completed) / Number(totalTasks)) * 100
      : 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl border p-6 transition-all duration-300",
        "bg-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1",
        isPinned
          ? "border-amber-200 bg-linear-to-br from-amber-50/40 to-transparent"
          : "border-slate-200",
      )}
    >
      {/* 1. Status Row: Pin & Total Count */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest",
            isPinned
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-500",
          )}
        >
          {isPinned ? (
            <Pin size={10} className="fill-current" />
          ) : (
            <Layers size={10} />
          )}
          <span>{isPinned ? "Pinned List" : "Collection"}</span>
        </div>

        <span className="text-[10px] font-bold text-slate-400">
          {totalTasks} Tasks
        </span>
      </div>

      {/* 2. Main Content */}
      <div className="flex-1 space-y-1">
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors truncate">
          {taskList.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {taskList.subtitle || "No description provided."}
        </p>
      </div>

      {/* 3. Progress Section (Visual Delight) */}
      {!(
        Number(taskList.summary.open || 0) +
          Number(taskList.summary.completed || 0) ===
        0
      ) && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 4. Footer: Summary Badges & Actions */}
      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {totalTasks === 0 ? (
            <span className="text-xs font-medium text-slate-400 italic">
              Empty list
            </span>
          ) : (
            pickTopSummaries(taskList.summary).map((item) => (
              <div
                key={item.key}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-bold",
                  item.color,
                )}
              >
                <span>{item.value}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <Link
            href={`/lists/${taskList.id}`}
            className="p-2 rounded-xl text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <ExternalLink size={16} />
          </Link>
          <UserFormTrigger
            value="EDIT_LIST"
            type="icon"
            iconName="edit"
            editItem={{ type: "tasklist", data: taskList }}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

function pickTopSummaries(summary: TaskListSummary, max = 3) {
  if (Number(summary.open || 0) + Number(summary.completed || 0) === 0)
    return [];
  return SUMMARY_PRIORITY.map((item) => ({
    ...item,
    value: summary[item.key as keyof typeof summary] || 0,
  }))
    .filter((item) => item.value > 0)
    .slice(0, max);
}
