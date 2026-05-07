"use client";

import { Popover } from "@/components/ui/PopOver";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Check } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Due Date", value: "due" },
  { label: "Priority", value: "priority" },
];

export function TaskSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const activeLabel =
    SORT_OPTIONS.find((o) => o.value === currentSort)?.label || "Sort";

  return (
    <Popover
      align="right"
      trigger={
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-200 transition-all text-sm font-semibold whitespace-nowrap">
          <ArrowUpDown size={16} className="text-slate-400" />
          <span>{activeLabel}</span>
        </button>
      }
    >
      <div className="flex flex-col gap-1">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSort(opt.value)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors text-left",
              currentSort === opt.value
                ? "bg-indigo-50 text-indigo-700 font-bold"
                : "text-slate-600 hover:bg-slate-50",
            )}
          >
            {opt.label}
            {currentSort === opt.value && <Check size={14} />}
          </button>
        ))}
      </div>
    </Popover>
  );
}
