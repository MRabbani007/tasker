"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, StickyNote, Star, Repeat, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEM_TYPES = [
  {
    value: "TASK",
    label: "Task",
    icon: CheckCircle2,
    color: "text-blue-500",
    glow: "bg-blue-500/20",
  },
  {
    value: "NOTE",
    label: "Note",
    icon: StickyNote,
    color: "text-amber-500",
    glow: "bg-amber-500/20",
  },
  {
    value: "HIGHLIGHT",
    label: "Highlight",
    icon: Star,
    color: "text-yellow-500",
    glow: "bg-yellow-500/20",
  },
  {
    value: "ROUTINE",
    label: "Routine",
    icon: Repeat,
    color: "text-rose-500",
    glow: "bg-rose-500/20",
  },
  {
    value: "REFLECTION",
    label: "Reflection",
    icon: BookOpen,
    color: "text-emerald-500",
    glow: "bg-emerald-500/20",
  },
] as const;

type ItemType = (typeof ITEM_TYPES)[number]["value"];

export function EntryTypeSelect({
  value,
  onChange,
}: {
  value: ItemType;
  onChange: (v: ItemType) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">
        Entry Protocol
      </label>

      <div className="relative flex p-1.5 gap-1 rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl w-full max-w-2xl">
        {ITEM_TYPES.map((item) => {
          const isActive = value === item.value;
          const Icon = item.icon;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-2 py-3 px-2 rounded-2xl transition-all duration-300",
                isActive
                  ? "text-slate-900 dark:text-white scale-105"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300",
              )}
            >
              {/* Animated Background Slider */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 rounded-2xl z-0"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}

              {/* Icon & Label */}
              <div className="relative z-10 flex items-center gap-2">
                <Icon
                  size={18}
                  className={cn(
                    "transition-colors duration-300",
                    isActive ? item.color : "text-slate-400",
                  )}
                />
                <span className="hidden md:block text-xs font-bold tracking-tight">
                  {item.label}
                </span>
              </div>

              {/* Active Glow Dot */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "absolute -bottom-1 w-1 h-1 rounded-full",
                    item.glow.replace("/20", ""),
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
