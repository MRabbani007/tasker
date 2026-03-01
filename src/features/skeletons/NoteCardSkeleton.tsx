"use client";

import { cn } from "@/lib/utils";

export function NoteCardSkeleton() {
  return (
    <div
      className={cn(
        "relative flex-1 flex flex-col rounded-2xl border bg-white/90 backdrop-blur-xl",
        "border-slate-200 shadow-sm animate-pulse",
      )}
    >
      {/* Date toggle placeholder */}
      <div className="mt-4 mx-6 h-4 w-40 rounded-md bg-slate-200" />

      {/* Utility bar placeholders */}
      <div className="absolute -top-3 right-2 flex gap-2">
        <div className="h-8 w-8 rounded-xl bg-slate-200" />
        <div className="h-8 w-8 rounded-xl bg-slate-200" />
      </div>

      {/* Main content */}
      <div className="p-6 flex flex-col gap-4">
        {/* Title */}
        <div className="h-7 w-2/3 rounded-md bg-slate-200" />

        {/* Details (paragraph lines) */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-[95%] rounded bg-slate-200" />
          <div className="h-4 w-[80%] rounded bg-slate-200" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/30 rounded-b-2xl">
        {/* Tags */}
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded bg-slate-200" />
          <div className="h-4 w-12 rounded bg-slate-200" />
          <div className="h-4 w-10 rounded bg-slate-200" />
        </div>

        {/* Status */}
        <div className="h-3 w-14 rounded bg-slate-200" />
      </div>
    </div>
  );
}
