"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Calendar,
  CalendarDays,
  AlertTriangle,
  Star,
  List,
} from "lucide-react";

export const TASK_FILTERS = [
  {
    id: "all",
    label: "All",
    icon: List,
    params: { completed: null, due: null, priority: null },
  },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircle,
    params: { completed: "true", due: null, priority: null },
  },
  {
    id: "today",
    label: "Today",
    icon: Calendar,
    params: { due: "today", completed: null, priority: null },
  },
  {
    id: "week",
    label: "This week",
    icon: CalendarDays,
    params: { due: "thisWeek", completed: null, priority: null },
  },
  {
    id: "important",
    label: "Important",
    icon: Star,
    params: { priority: "important", completed: null, due: null },
  },
  {
    id: "overdue",
    label: "Overdue",
    icon: AlertTriangle,
    params: { due: "overdue", completed: null, priority: null },
  },
] as const;

export default function TaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (params: Record<string, string | null>) => {
    // If it's the "All" filter
    if (
      params.completed === null &&
      params.due === null &&
      params.priority === null
    ) {
      return (
        !searchParams.get("completed") &&
        !searchParams.get("due") &&
        !searchParams.get("priority")
      );
    }
    // Check if the specific key-value pair exists
    return Object.entries(params).some(
      ([key, value]) => value !== null && searchParams.get(key) === value,
    );
  };

  const applyFilter = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) newParams.delete(key);
      else newParams.set(key, value);
    });

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
      {TASK_FILTERS.map((filter) => {
        const active = isActive(filter.params);
        const Icon = filter.icon;

        return (
          <button
            key={filter.id}
            onClick={() => applyFilter(filter.params)}
            className={cn(
              "relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 whitespace-nowrap",
              active
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
            )}
          >
            <Icon
              size={14}
              className={cn("transition-transform", active && "scale-110")}
            />
            <span>{filter.label}</span>
            {active && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-xl ring-2 ring-indigo-500/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
