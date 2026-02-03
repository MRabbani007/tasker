"use client";

import { TaskList } from "../../../generated/prisma/client";
import { ExternalLink, Inbox, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import UserFormTrigger from "@/components/UserFormTrigger";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CalendarRange,
  CheckCircle,
  Circle,
  Clock,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SUMMARY_PRIORITY = [
  {
    key: "important",
    label: "Important",
    color: "text-red-500",
    icon: AlertTriangle,
  },
  {
    key: "dueToday",
    label: "Today",
    color: "text-orange-500",
    icon: CalendarDays,
  },
  {
    key: "dueThisWeek",
    label: "This week",
    color: "text-yellow-500",
    icon: CalendarRange,
  },
  { key: "overdue", label: "Overdue", color: "text-rose-600", icon: Clock },
  { key: "open", label: "Open", color: "text-blue-500", icon: Circle },
  {
    key: "completed",
    label: "Completed",
    color: "text-green-500",
    icon: CheckCircle,
  },
];

function isEmptyList(summary: TaskListSummary) {
  return summary.open + summary.completed === 0;
}

function pickTopSummaries(summary: TaskListSummary, max = 2) {
  if (isEmptyList(summary)) return [];

  return SUMMARY_PRIORITY.map((item) => ({
    ...item,
    value: summary[item.key as keyof TaskListSummary],
  }))
    .filter((item) => item.value > 0)
    .slice(0, max);
}

export default function TaskListCard({
  taskList,
}: {
  taskList: TaskList & {
    summary: TaskListSummary;
  };
}) {
  const isPinned = !!taskList.pinnedAt;
  const isEmpty = taskList.summary.open + taskList.summary.completed === 0;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-white p-5 transition-all flex flex-col",
        "hover:-translate-y-0.5 hover:shadow-md",
        isPinned
          ? "border-sky-200 bg-sky-50/40"
          : "border-zinc-200 hover:border-zinc-300",
      )}
    >
      {/* Pin indicator */}
      {isPinned && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700">
          <Pin size={12} />
          Pinned
        </div>
      )}

      {/* Header */}
      <div className="flex-1 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-zinc-900">
            {taskList.title}
          </h3>

          {taskList.subtitle?.trim() && (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
              {taskList.subtitle}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition flex items-center gap-2">
          <Link href={`/lists/${taskList.id}`}>
            <ExternalLink size={20} />
          </Link>
          <UserFormTrigger
            value="EDIT_LIST"
            type="icon"
            iconName="edit"
            editItem={{ type: "tasklist", data: taskList }}
          />
        </div>
      </div>

      {/* Footer / Meta */}
      <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
        {isEmpty ? (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Inbox size={20} />
            <span>No tasks yet</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {pickTopSummaries(taskList.summary).map((item) => (
              <Tooltip key={item.key}>
                <TooltipTrigger>
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
                      "bg-muted/50",
                      item.color,
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    <span>{item.value}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {item.value} tasks {item.label.toLowerCase()}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}

        {/* Future: progress / due info */}
        {/* <ProgressBar /> */}
      </div>
    </div>
  );
}
