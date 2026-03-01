"use client";

import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Pin,
  X,
} from "lucide-react";
import DropList from "./DropList";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

const MOBILE_BREAKPOINT = 768;

export default function DraggableUserLists({
  taskLists,
  showUserLists,
  setShowUserLists,
  coordinates,
}: {
  showUserLists: boolean;
  setShowUserLists: Dispatch<SetStateAction<boolean>>;
  taskLists: {
    id: string;
    name: string;
    pinnedAt?: Date | null;
    deletedAt?: Date | null;
  }[];
  coordinates: { x: number; y: number };
}) {
  const { openUserLists, setOpenUserLists } = useUser();

  const [docked, setDocked] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `sidebar`,
      disabled: docked,
    });

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("lists-sidebar-open");

      if (saved !== null) {
        setOpenUserLists(saved === "true");
        setHydrated(true);
        return;
      }

      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setOpenUserLists(false);
      }

      setHydrated(true);
    };

    load();
  }, []);

  const style = {
    transform: transform
      ? `translate3d(${coordinates.x + transform.x}px, ${coordinates.y + transform.y}px, 0)`
      : `translate3d(${coordinates.x}px, ${coordinates.y}px, 0)`,
  };

  const pinned = taskLists.filter((l) => !!l.pinnedAt && !l.deletedAt);
  const regular = taskLists.filter((l) => !l.pinnedAt && !l.deletedAt);

  const content = (
    <div className="flex-1 flex flex-col gap-4 py-4 pl-4 pr-6">
      {/* Pinned */}
      {pinned.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            <Pin size={12} />
            Pinned
          </p>
          {pinned.map((list) => (
            <DropList key={list.id} list={list} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {pinned.length > 0 && (
          <p className="text-xs font-medium text-zinc-500 mt-2">All Lists</p>
        )}
        {/* All Lists */}
        {regular.map((list) => (
          <DropList key={list.id} list={list} />
        ))}
      </div>
    </div>
  );

  if (!showUserLists) {
    return null;
  }

  if (docked) {
    return (
      <aside
        className={cn(
          "relative border-r border-zinc-200 transition-all duration-300 hidden md:inline-flex group/userlists",
          openUserLists ? "w-64" : "w-0",
          !hydrated && "invisible",
        )}
      >
        {/* Dock / Close */}
        <div
          className={cn(
            "z-50 absolute top-2 flex flex-col items-center justify-center gap-1.5 translate-y-1",
            openUserLists ? "left-60" : "left-0",
          )}
        >
          <button
            onClick={() => setDocked((v) => !v)}
            className={cn(
              "p-2 rounded-lg shadow-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors",
              "transition-all duration-200 opacity-0 ",
              openUserLists
                ? "group-hover/userlists:opacity-100 group-hover/userlists:translate-y-0"
                : "",
            )}
          >
            {docked ? (
              <PanelLeftOpen size={14} />
            ) : (
              <PanelLeftClose size={14} />
            )}
          </button>
          <button
            onClick={() => setShowUserLists(false)}
            className={cn(
              "p-2 rounded-lg shadow-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors",
              "transition-all duration-200 opacity-0 ",
              openUserLists
                ? "group-hover/userlists:opacity-100 group-hover/userlists:translate-y-0"
                : "",
            )}
          >
            <X size={14} />
          </button>
          {/* Toggle Button */}
          <button
            onClick={() => setOpenUserLists((curr) => !curr)}
            className={cn(
              " border border-zinc-200 bg-white p-1.5 shadow",
              "hover:bg-zinc-100 transition",
              openUserLists
                ? "left-60 rounded-lg"
                : "left-0 rounded-r-lg border-l-0",
            )}
            aria-label={openUserLists ? "Collapse sidebar" : "Expand sidebar"}
          >
            {openUserLists ? (
              <ChevronLeft size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        </div>
        {/* Main Side Bar */}
        <div
          className={cn(
            "flex-1 flex flex-col",
            openUserLists ? "" : "opacity-0 pointer-events-none",
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "flex items-center gap-2 p-4 cursor-default text-zinc-400",
            )}
          >
            <GripVertical size={16} className="text-zinc-400" />
            <p
              className="font-semibold text-zinc-800"
              onClick={() => console.log("first")}
            >
              Collections
            </p>
          </div>
          {content}
        </div>
      </aside>
    );
  } else {
    return (
      <div
        className={cn(
          // ? "md:sticky hidden md:inline-block top-4"
          "fixed top-4 left-4 z-60",
          showUserLists ? "w-64" : "w-0",
          isDragging && "pointer-events-none",
        )}
      >
        <aside
          ref={setNodeRef}
          style={docked ? {} : style}
          className={cn(
            " border border-zinc-200 shadow-sm rounded-2xl p-4 space-y-4 bg-white group/userlists",
            showUserLists ? "" : "invisible opacity-0 pointer-events-none",
            isDragging ? "opacity-90 cursor-grabbing" : "cursor-grab",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              docked
                ? "cursor-default text-zinc-400"
                : "cursor-grab active:cursor-grabbing",
            )}
            {...listeners}
            {...attributes}
          >
            <GripVertical size={16} className="text-zinc-400" />
            <p
              className="font-semibold text-zinc-800"
              onClick={() => console.log("first")}
            >
              Collections
            </p>
          </div>
          <div className="absolute -top-3 -right-2 flex items-center gap-1.5 opacity-0 group-hover/userlists:opacity-100 transition-all duration-200 translate-y-1 group-hover/userlists:translate-y-0">
            <button
              onClick={() => setDocked((v) => !v)}
              className="p-2 rounded-xl shadow-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors"
            >
              {docked ? (
                <PanelLeftOpen size={18} />
              ) : (
                <PanelLeftClose size={18} />
              )}
            </button>
            <button
              onClick={() => setShowUserLists(false)}
              className="p-2 rounded-xl shadow-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          {content}
        </aside>
      </div>
    );
  }
}
