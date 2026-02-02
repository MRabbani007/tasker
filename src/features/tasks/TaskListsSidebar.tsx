"use client";

import Link from "next/link";
import { TaskList } from "../../../generated/prisma/client";
import { Plus, Pin, ListChecks } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  lists: TaskList[];
}

export default function TaskListsSidebar({ lists }: Props) {
  const pathname = usePathname();
  const activeId = pathname?.split("/").pop();

  const pinned = lists.filter((l) => l.pinnedAt && !l.deletedAt);
  const regular = lists.filter((l) => !l.pinnedAt && !l.deletedAt);

  return (
    <aside className="hidden md:inline-flex w-52 shrink-0 border-r border-zinc-200 bg-zinc-50">
      <div className="p-4 flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-700">Lists</h2>
          <button className="rounded-lg p-1.5 hover:bg-zinc-200 transition">
            <Plus size={16} />
          </button>
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <Pin size={12} />
              Pinned
            </p>

            {pinned.map((list) => (
              <SidebarItem
                key={list.id}
                list={list}
                active={list.id === activeId}
              />
            ))}
          </div>
        )}

        {/* All Lists */}
        <div className="flex flex-col gap-1">
          {pinned.length > 0 && (
            <p className="text-xs font-medium text-zinc-500 mt-2">All Lists</p>
          )}

          {regular.map((list) => (
            <SidebarItem
              key={list.id}
              list={list}
              active={list.id === activeId}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ list, active }: { list: TaskList; active: boolean }) {
  return (
    <Link
      href={`/lists/${list.id}`}
      className={cn(
        "group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition",
        active
          ? "bg-zinc-200 font-medium text-zinc-900"
          : "text-zinc-700 hover:bg-zinc-100",
      )}
    >
      <ListChecks size={16} className="shrink-0" />
      <span className="truncate">{list.title}</span>
    </Link>
  );
}
