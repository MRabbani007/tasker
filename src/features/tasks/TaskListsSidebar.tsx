"use client";

import Link from "next/link";
import { TaskList } from "../../../generated/prisma/client";
import { Plus, Pin, ListChecks, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
  lists: TaskList[];
}

const MOBILE_BREAKPOINT = 768;

export default function TaskListsSidebar({ lists }: Props) {
  const [open, setOpen] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("lists-sidebar-open");

      if (saved !== null) {
        setOpen(saved === "true");
        setHydrated(true);
        return;
      }

      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setOpen(false);
      }

      setHydrated(true);
    };

    load();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("lists-sidebar-open", String(open));
  }, [open, hydrated]);

  const pathname = usePathname();
  const activeId = pathname?.split("/").pop();

  const pinned = lists.filter((l) => l.pinnedAt && !l.deletedAt);
  const regular = lists.filter((l) => !l.pinnedAt && !l.deletedAt);

  return (
    <>
      {/* Floating toggle */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "absolute top-20 translate-y-0 z-50",
          "rounded-r-lg border border-l-0 border-zinc-200 bg-white p-1.5 shadow",
          "hover:bg-zinc-100 transition",
          open ? "left-64" : "left-0",
        )}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      <aside
        className={cn(
          "relative border-r border-zinc-200 bg-zinc-50 transition-all duration-300 inline-flex",
          open ? "w-64" : "w-0",
          !hydrated && "invisible",
        )}
      >
        <div
          className={cn(
            "overflow-hidden transition-opacity duration-200 p-4 flex-1 flex flex-col gap-4",
            open ? "opacity-100" : "opacity-0",
          )}
        >
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
              <p className="text-xs font-medium text-zinc-500 mt-2">
                All Lists
              </p>
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
    </>
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
