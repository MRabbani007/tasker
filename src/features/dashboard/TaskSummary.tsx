"use client";

import {
  Calendar,
  Clock,
  Flag,
  Inbox,
  AlertCircle,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TaskStats {
  today: number;
  overdue: number;
  scheduled: number;
  flagged: number;
  completed: number;
  thisWeek: number;
  openTasks: number; // No due date
  highPriorityOverdue: number; // Priority > 4
}

export default function SmartTaskSummary({ stats }: { stats: TaskStats }) {
  // Logic to determine which 4 cards to show
  const getVisibleCards = () => {
    const cards = [];

    // 1. Critical: Overdue with Priority > 4
    if (stats.highPriorityOverdue > 0) {
      cards.push({
        label: "Critical",
        count: stats.highPriorityOverdue,
        icon: <AlertCircle className="text-rose-600" />,
        bg: "bg-rose-50",
        border: "border-rose-100",
        href: "/tasks?filter=critical",
      });
    }

    // 2. Urgent: Today
    cards.push({
      label: "Today",
      count: stats.today,
      icon: <Calendar className="text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      href: "/tasks?filter=today",
      emptyText: "All clear for today!",
    });

    // 3. Status: Overdue (General)
    if (stats.overdue > 0 && stats.highPriorityOverdue === 0) {
      cards.push({
        label: "Overdue",
        count: stats.overdue,
        icon: <Clock className="text-orange-600" />,
        bg: "bg-orange-50",
        border: "border-orange-100",
        href: "/tasks?filter=overdue",
      });
    }

    // 4. Activity: This Week
    if (stats.thisWeek > 0) {
      cards.push({
        label: "This Week",
        count: stats.thisWeek,
        icon: <CalendarDays className="text-emerald-600" />,
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        href: "/tasks?filter=week",
      });
    }

    // 5. Organization: Open (No Due Date)
    if (cards.length < 4 && stats.openTasks > 0) {
      cards.push({
        label: "Inbox",
        count: stats.openTasks,
        icon: <Inbox className="text-slate-600" />,
        bg: "bg-slate-50",
        border: "border-slate-200",
        href: "/tasks?filter=inbox",
      });
    }

    // 6. Backup/New User: Flagged or Completed
    if (cards.length < 4) {
      cards.push({
        label: "Flagged",
        count: stats.flagged,
        icon: <Flag className="text-amber-500" />,
        bg: "bg-amber-50",
        border: "border-amber-100",
        href: "/tasks?filter=flagged",
      });
    }

    return cards.slice(0, 4); // Always return exactly 4 for the grid
  };

  const visibleCards = getVisibleCards();

  // Handle New User / Totally Empty State
  const isTotallyEmpty = Object.values(stats).reduce((a, b) => a + b, 0) === 0;

  if (isTotallyEmpty) {
    return (
      <div className="w-full p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 text-indigo-600">
          <Sparkles size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Your journey starts here
        </h3>
        <p className="text-sm text-slate-500 max-w-xs mt-1">
          You don&apos;t have any tasks yet. Create your first task to see the
          magic happen.
        </p>
        <Link
          href="/tasks"
          className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
        >
          + Create a task
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {visibleCards.map((card, i) => (
        <Link
          key={i}
          href={card.href}
          className={cn(
            "p-5 rounded-3xl border transition-all hover:shadow-lg hover:scale-[1.02] group",
            card.bg,
            card.border,
          )}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <span
              className={cn(
                "text-2xl font-black tracking-tight",
                card.count === 0 ? "text-slate-300" : "text-slate-900",
              )}
            >
              {card.count}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              {card.label}
            </p>
            <p className="text-xs font-bold text-slate-600 truncate">
              {card.count === 0
                ? card.emptyText || "No tasks"
                : `${card.count} tasks assigned`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
