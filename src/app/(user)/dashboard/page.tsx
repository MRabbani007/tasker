import {
  CheckCircle2,
  Clock,
  StickyNote,
  Calendar,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Kanban,
  Zap,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/utils";
import type { Metadata } from "next";
import { ReactNode } from "react";
import FadeIn from "@/components/animation/FadeIn";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Get an overview of your tasks, notes, journals, and activity in one unified dashboard.",
  openGraph: {
    title: "Dashboard · Tasker",
    description:
      "Your productivity overview — tasks, notes, and journals at a glance.",
  },
};

export default async function DashboardPage() {
  // Mock data - replace with your prisma calls
  const stats = [
    {
      label: "Active Tasks",
      value: "12",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Open Notes",
      value: "5",
      icon: StickyNote,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Deadlines",
      value: "3",
      icon: Clock,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const user = await getCurrentUser();

  return (
    <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Header & Greeting */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-slate-500 font-medium">
            You have 3 tasks due today. Let&apos;s make progress!
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
          <TrendingUp className="h-4 w-4 text-indigo-600" />
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
            75% Weekly Completion
          </span>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {/* Row 1: Quick Stats */}
        {stats.map((stat, i) => (
          <FadeIn
            key={stat.label}
            index={i}
            className="md:col-span-2 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-4",
                stat.bg,
              )}
            >
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              {stat.label}
            </p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {stat.value}
            </h3>
          </FadeIn>
        ))}

        {/* Row 2: Recent Activity (Large Bento) */}
        <div className="md:col-span-2 lg:col-span-2 p-8 rounded-4xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Kanban className="text-indigo-400" /> Current Sprint
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    <span className="text-sm font-medium">
                      Design System Update {i}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    Due Today
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300"
            >
              View full list <ArrowUpRight size={16} />
            </Link>
          </div>
          {/* Abstract BG Decor */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full" />
        </div>

        {/* Upcoming Tools (Vertical Sidebar Bento) */}
        <div className="md:col-span-2 lg:col-span-2 space-y-6">
          <ToolCard
            title="Journal"
            desc="Reflect on today"
            icon={<BookOpen size={20} />}
            href="/journal"
            color="bg-amber-100 text-amber-700"
          />
          <ToolCard
            title="Planner"
            desc="Weekly Schedule"
            icon={<Calendar size={20} />}
            href="/calendar"
            color="bg-emerald-100 text-emerald-700"
          />
          <ToolCard
            title="Kanban"
            desc="Agile Board"
            icon={<Kanban size={20} />}
            href="/kanban"
            color="bg-indigo-100 text-indigo-700"
          />
        </div>

        {/* Weekly Velocity */}
        <div className="md:col-span-2 lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">
              Weekly Velocity
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              +12% from last week
            </p>
          </div>

          <div className="flex items-end justify-between gap-1 h-24 mt-4">
            {[40, 70, 45, 90, 65, 40, 80].map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className={cn(
                  "w-full rounded-t-lg transition-all duration-500",
                  i === 6
                    ? "bg-indigo-600"
                    : "bg-slate-100 group-hover:bg-indigo-100",
                )}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Row 3: Recent Note (Small Bento) */}
        <div className="md:col-span-4 lg:col-span-3 p-6 rounded-3xl bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800">Latest Note</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              2 hours ago
            </span>
          </div>
          <p className="text-slate-600 italic line-clamp-3 leading-relaxed">
            &ldquo;Need to finalize the database schema for the journal feature.
            Remember to add the entry metadata and tags support...&rdquo;
          </p>
        </div>

        {/* Quick Capture Card */}
        <div className="md:col-span-4 lg:col-span-3 p-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap size={18} className="fill-white" /> Quick Capture
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="I need to..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-sm placeholder:text-indigo-200 outline-none focus:bg-white/20 transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white text-indigo-600 rounded-xl hover:scale-105 transition-transform">
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
            <p className="text-[10px] mt-3 font-medium text-indigo-100/70 uppercase tracking-widest">
              Press{" "}
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded border border-white/20">
                Enter
              </kbd>{" "}
              to save to Inbox
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function ToolCard({
  title,
  desc,
  icon,
  href,
  color,
}: {
  title: string;
  desc: string;
  icon: ReactNode;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all group"
    >
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
          color,
        )}
      >
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <ArrowUpRight
        size={14}
        className="ml-auto text-slate-300 group-hover:text-indigo-500"
      />
    </Link>
  );
}
