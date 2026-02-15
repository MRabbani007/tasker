"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const priorities = [
  {
    value: 1,
    label: "Someday",
    color: "text-slate-400",
    bgColor: "bg-slate-50",
  },
  { value: 2, label: "Low", color: "text-blue-500", bgColor: "bg-blue-50" },
  {
    value: 3,
    label: "Normal",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
  },
  {
    value: 4,
    label: "Important",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  { value: 5, label: "Critical", color: "text-red-500", bgColor: "bg-red-50" },
];

export default function PrioritySelector({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = priorities.find((p) => p.value === value) || priorities[1];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-2 px-3 py-2 rounded-xl border border-slate-100 transition-all
      ${current.bgColor} ${current.color} hover:border-slate-300`}
      >
        <span className="text-sm font-semibold">{current.label}</span>
        <ChevronDown
          size={15}
          className={cn("duration-200", open ? "rotate-180" : "")}
        />
      </button>
      <div
        className={cn(
          "absolute z-50 mt-0 min-w-45 rounded-2xl border border-slate-100 bg-white shadow-2xl p-1.5 flex items-center gap-2 duration-200",
          open
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none",
        )}
      >
        {priorities.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => {
              onChange(p.value);
              setOpen(false);
            }}
            className={cn(
              `flex items-center justify-between px-3 py-2.5 hover:bg-zinc-100 rounded-lg text-sm font-medium transition-colors text-left`,
              value === p.value ? "bg-slate-100" : "",
              p.color,
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
