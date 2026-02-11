"use client";

import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import DropList from "./DropList";
import { Dispatch, SetStateAction, useState } from "react";

export default function DraggableUserLists({
  taskLists,
  showUserLists,
  setShowUserLists,
  coordinates,
}: {
  showUserLists: boolean;
  setShowUserLists: Dispatch<SetStateAction<boolean>>;
  taskLists: { id: string; name: string }[];
  coordinates: { x: number; y: number };
}) {
  const [docked, setDocked] = useState(true);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `sidebar`,
      disabled: docked,
    });

  const style = {
    transform: transform
      ? `translate3d(${coordinates.x + transform.x}px, ${coordinates.y + transform.y}px, 0)`
      : `translate3d(${coordinates.x}px, ${coordinates.y}px, 0)`,
  };

  return (
    <div
      className={cn(
        docked
          ? "md:sticky hidden md:inline-block top-4"
          : "fixed top-4 left-4 z-60",
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
        {taskLists.map((list) => (
          <DropList key={list.id} list={list} />
        ))}
      </aside>
    </div>
  );
}
