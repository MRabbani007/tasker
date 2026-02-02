"use client";

import { TaskList } from "../../../generated/prisma/client";
import { ExternalLink, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import UserFormTrigger from "@/components/UserFormTrigger";
import Link from "next/link";

export default function TaskListCard({ taskList }: { taskList: TaskList }) {
  const isPinned = !!taskList.pinnedAt;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-white p-5 transition-all",
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
      <div className="flex items-start justify-between gap-4">
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
        <span>
          {/* Placeholder for stats */}
          No tasks yet
        </span>

        {/* Future: progress / due info */}
        {/* <ProgressBar /> */}
      </div>
    </div>
  );
}
