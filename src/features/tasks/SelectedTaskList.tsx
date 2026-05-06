"use client";

import { ChevronDown, Calendar, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils"; // Standard Tailwind merge utility
import { useTasks } from "@/context/TaskProvider";
import UserFormTrigger from "@/components/UserFormTrigger";

export default function SelectedTaskList({
  selectedListId,
}: {
  selectedListId?: string | null;
}) {
  const { taskLists } = useTasks();

  const selectedList = selectedListId
    ? (taskLists.find((item) => item.id === selectedListId) as TaskListDTO)
    : null;

  if (!selectedList) return null;

  const { summary, color, title, subtitle, icon } = selectedList;
  const accentColor = color || "#4f46e5"; // Fallback to your indigo

  return (
    <UserFormTrigger
      type="container"
      value="SELECT_LIST"
      className="block w-full max-w-4xl"
    >
      <button className="group relative w-full flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 text-left">
        {/* Left Section: Identity */}
        <div className="flex items-center gap-5">
          <div
            className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300"
            style={{
              backgroundColor: `${accentColor}15`, // 15% opacity background
              color: accentColor,
            }}
          >
            {/* <IconRenderer iconString={icon} size={28} /> */}
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
            {subtitle && (
              <p className="text-slate-500 text-sm font-medium line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Summary Stats (Production Grade Data Viz) */}
        {summary && (
          <div className="flex items-center gap-4 self-end md:self-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <StatItem
              label="Overdue"
              value={summary.overdue}
              icon={<Clock size={14} />}
              variant={summary.overdue > 0 ? "danger" : "neutral"}
            />
            <StatItem
              label="Today"
              value={summary.dueToday}
              icon={<Calendar size={14} />}
              variant="warning"
            />
            <StatItem
              label="Done"
              value={summary.completed}
              icon={<CheckCircle2 size={14} />}
              variant="success"
            />
          </div>
        )}

        {/* Subtle Decorative Accent */}
        <div
          className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-all group-hover:h-1/2"
          style={{ backgroundColor: accentColor }}
        />
      </button>
    </UserFormTrigger>
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
        "flex flex-col items-center min-w-14 p-2 rounded-xl border transition-colors",
        styles[variant],
      )}
    >
      <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider opacity-80">
        {icon}
        {label}
      </span>
      <span className="text-lg font-extrabold leading-none mt-1">{value}</span>
    </div>
  );
}
