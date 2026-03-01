"use client";

import React from "react";
import { JournalEntry } from "../../../generated/prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import UserFormTrigger from "@/components/UserFormTrigger";
import {
  CheckCircle2,
  StickyNote,
  Star,
  Repeat,
  BookOpen,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  task: {
    icon: CheckCircle2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  note: {
    icon: StickyNote,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  highlight: {
    icon: Star,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  routine: {
    icon: Repeat,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  journal: {
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
};

export function formatJournalDate(date: Date) {
  return format(date, "EEE, d MMM");
}

export default function JournalEntriesGroup({
  title,
  entries,
}: {
  title: string;
  entries: JournalEntry[];
}) {
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {/* Group Header with Glass Pill */}
      <div className="flex items-center gap-4 mb-6 px-2">
        <span className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-950/50 px-4 py-1 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
          {title}
        </h2>
        <span className="h-px flex-1 bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {entries.map((item, idx) => {
            const config =
              TYPE_CONFIG[
                item.type?.toLowerCase() as keyof typeof TYPE_CONFIG
              ] || TYPE_CONFIG.journal;
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.05,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <UserFormTrigger
                  type="container"
                  value="EDIT_JOURNAL_ENTRY"
                  editItem={{ type: "journal", data: item }}
                  className="group relative h-full flex flex-col gap-4 p-5 rounded-4xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/60 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Decorative Gradient Blob */}
                  <div
                    className={cn(
                      "absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700",
                      config.bg,
                    )}
                  />

                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "p-3 rounded-2xl border transition-transform duration-500 group-hover:scale-110",
                        config.bg,
                        config.border,
                      )}
                    >
                      <Icon size={22} className={config.color} />
                    </div>
                    {item.occurredOn && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500">
                        <Clock size={12} />
                        {format(new Date(item.occurredOn), "MMM d")}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {item.subject && (
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {item.subject}
                      </h3>
                    )}
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-4 font-medium">
                      {item.content}
                    </p>
                  </div>

                  {/* Visual Footer hint */}
                  <div className="mt-auto pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                      Click to expand
                    </span>
                  </div>
                </UserFormTrigger>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
