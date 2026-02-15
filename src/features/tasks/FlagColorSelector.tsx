"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface FlagColorSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const FLAG_COLORS = [
  { value: null, label: "No flag", className: "bg-slate-200" },
  { value: "bg-blue-500", label: "Blue", className: "bg-blue-500" },
  { value: "bg-green-500", label: "Green", className: "bg-green-500" },
  { value: "bg-yellow-500", label: "Yellow", className: "bg-yellow-500" },
  { value: "bg-orange-500", label: "Orange", className: "bg-orange-500" },
  { value: "bg-red-500", label: "Red", className: "bg-red-500" },
  { value: "bg-purple-500", label: "Purple", className: "bg-purple-500" },
];

export function FlagColorSelector({ value, onChange }: FlagColorSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = FLAG_COLORS.find((c) => c.value === value) || FLAG_COLORS[0];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between p-2 rounded-xl bg-white hover:border-slate-300 transition"
      >
        <span
          className={`w-5 h-5 rounded-full ${
            current.value ? current.className : "bg-slate-300"
          }`}
        />
      </button>
      <div
        className={cn(
          "absolute z-50 mt-2 min-w-45 rounded-xl border border-slate-100 bg-white shadow-xl p-1.5 flex items-center gap-2 duration-200",
          open
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none",
        )}
      >
        {FLAG_COLORS.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => {
              onChange(c.value);
              setOpen(false);
            }}
            className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-slate-50"
          >
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                c.value ? c.className : "bg-slate-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
