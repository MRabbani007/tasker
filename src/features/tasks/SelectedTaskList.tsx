"use client";

import { ChevronDown, Calendar, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils"; // Standard Tailwind merge utility
import { useTasks } from "@/context/TaskProvider";
import UserFormTrigger from "@/components/UserFormTrigger";
import { IconRenderer } from "@/lib/icons/lucide";

export default function SelectedTaskList({
  selectedListId,
}: {
  selectedListId?: string | null;
}) {
  const { taskLists, getListSummary } = useTasks();

  const selectedList = selectedListId
    ? (taskLists.find((item) => item.id === selectedListId) as TaskListDTO)
    : null;

  // 1. Resolve Display Data (Selected List vs. Global View)
  const displayData = selectedList
    ? {
        title: selectedList.title,
        subtitle: selectedList.subtitle || "Project List",
        icon: selectedList.icon,
        color: selectedList.color || "#4f46e5",
        summary: getListSummary(selectedList.id),
      }
    : {
        title: "All Tasks",
        subtitle: "Global Task Board",
        icon: "lucide:LayoutGrid", // Using a dashboard icon for 'All'
        color: "#64748b", // Neutral slate for global view
        summary: getListSummary(""), // Assuming getListSummary() with no ID returns totals
      };

  const { title, subtitle, icon, color, summary } = displayData;

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100 p-6 shadow-sm transition-all duration-500 overflow-hidden">
      <div className="flex items-stretch flex-wrap md:flex-nowrap gap-6">
        {/* Left Section: Identity */}
        <UserFormTrigger
          type="container"
          value="SELECT_LIST"
          className="flex items-center gap-5 mr-auto cursor-pointer"
        >
          <div
            className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300 shadow-sm"
            style={{
              backgroundColor: `${color}15`,
              color: color,
            }}
          >
            <IconRenderer iconString={icon} size={28} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {title}
              </h2>
              <ChevronDown
                size={18}
                className="text-slate-400 group-hover:translate-y-0.5 transition-transform"
              />
            </div>
            <p className="text-slate-500 text-sm font-medium line-clamp-1">
              {subtitle}
            </p>
          </div>
        </UserFormTrigger>

        {/* Right Section: Summary Stats */}
        {summary && (
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <StatItem
              label="Overdue"
              value={summary.overdue}
              icon={<Clock size={18} />}
              variant={summary.overdue > 0 ? "danger" : "neutral"}
            />
            <StatItem
              label="Today"
              value={summary.dueToday}
              icon={<Calendar size={18} />}
              variant="warning"
            />
            <StatItem
              label="Done"
              value={summary.completed}
              icon={<CheckCircle2 size={18} />}
              variant="success"
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {summary?.open ?? 0} active tasks
          </span>
        </div>

        <UserFormTrigger
          type="container"
          value="SELECT_LIST"
          className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors z-10"
        >
          {selectedList ? "Switch List →" : "Select List →"}
        </UserFormTrigger>
      </div>

      {/* Subtle Side Accent */}
      <div
        className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-all group-hover:top-4 group-hover:bottom-4"
        style={{ backgroundColor: color }}
      />

      {/* Background Glow */}
      <div
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl opacity-[0.07] transition-opacity group-hover:opacity-10"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// Sub-component for clean organization
function StatItem({
  label,
  value,
  icon,
  variant,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: "danger" | "warning" | "success" | "neutral";
}) {
  const styles = {
    danger: "text-red-600 bg-red-50 border-red-100",
    warning: "text-amber-600 bg-amber-50 border-amber-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    neutral: "text-slate-400 bg-slate-50 border-slate-100",
  };

  if (value === 0 && variant === "neutral") return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-1 min-w-20 p-2 rounded-xl border transition-colors",
        styles[variant],
      )}
    >
      <p>
        <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider opacity-80">
          {label}
        </span>
      </p>
      <p className="flex items-center justify-between gap-2">
        {icon}
        <span className="text-lg font-extrabold leading-none mt-1">
          {value}
        </span>
      </p>
    </div>
  );
}
