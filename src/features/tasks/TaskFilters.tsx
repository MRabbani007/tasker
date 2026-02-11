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
    params: {},
  },
  {
    id: "completed",
    label: "Completed",
    icon: CheckCircle,
    params: { completed: "true" },
  },
  {
    id: "today",
    label: "Today",
    icon: Calendar,
    params: { due: "today" },
  },
  {
    id: "week",
    label: "This week",
    icon: CalendarDays,
    params: { due: "thisWeek" },
  },
  {
    id: "important",
    label: "Important",
    icon: Star,
    params: { priority: "important" },
  },
  {
    id: "overdue",
    label: "Overdue",
    icon: AlertTriangle,
    params: { due: "overdue" },
  },
] as const;

export default function TaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const completed = searchParams.get("completed");
  const due = searchParams.get("due");
  const priority = searchParams.get("priority");

  const isActive = (params: Record<string, string>) => {
    if (Object.keys(params).length === 0) {
      return !completed && !due && !priority;
    }

    return Object.entries(params).every(
      ([key, value]) => searchParams.get(key) === value,
    );
  };

  const applyFilter = (params: Record<string, string>) => {
    const newParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value);
    });

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2 md:ml-auto">
      {TASK_FILTERS.map((filter) => {
        const active = isActive(filter.params);
        const Icon = filter.icon;

        return (
          <motion.button
            key={filter.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => applyFilter(filter.params)}
            className={cn(
              "group flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition duration-200",
              active
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-700 dark:hover:text-gray-200",
            )}
            title={filter.label}
          >
            <Icon size={14} className={active ? "" : "opacity-70"} />

            {/* Hide text on small screens if you want icon-only */}
            <span className="hidden sm:inline">{filter.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
