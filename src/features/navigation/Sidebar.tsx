"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  ChartGantt,
  CircleCheckBig,
  ListChecks,
  LogOut,
  NotebookPen,
  NotepadText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "My Tasks", icon: CircleCheckBig, url: "/tasks" },
  { label: "My Lists", icon: ListChecks, url: "/lists" },
  { label: "Calendar", icon: Calendar, url: "/calendar" },
  { label: "Kanban", icon: ChartGantt, url: "/kanban" },
  { label: "Journal", icon: NotepadText, url: "/journal" },
  { label: "Notes", icon: NotebookPen, url: "/notes" },
];

export default function Sidebar({ user }: { user?: { firstName: string } }) {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();
  const isAdmin = true; // Logic check

  // 1. Keyboard Shortcut Logic (⌘+B or Ctrl+B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-white border-r border-slate-200 duration-300 relative transition-all ease-in-out",
        collapsed ? "w-20" : "w-65",
      )}
    >
      {/* 2. Enhanced Toggle with Shortcut Hint */}
      <div className="group/toggle absolute -right-3 top-10 z-50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-indigo-600 hover:text-white transition-all"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Tooltip hint */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover/toggle:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
          {collapsed ? "Expand" : "Collapse"}{" "}
          <span className="text-slate-400 ml-1">⌘B</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className={cn("p-6 mb-2", collapsed ? "px-4" : "px-6")}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-indigo-200 shadow-lg group-hover:scale-105 transition-transform">
            <span className="font-bold">{user?.firstName?.[0] || "U"}</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-slate-800 truncate">
                {user?.firstName || "User"}
              </span>
              <span className="text-[10px] font-medium text-indigo-500 uppercase tracking-wider">
                Pro Plan
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  "shrink-0",
                  isActive ? "text-indigo-600" : "group-hover:text-indigo-500",
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
              )}
            </Link>
          );
        })}

        {/* Admin Section */}
        {isAdmin && !collapsed && (
          <div className="pt-4 pb-2 px-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Admin
            </p>
          </div>
        )}
        {isAdmin && (
          <Link
            href="/admin/users"
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
              pathname.startsWith("/admin")
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-50",
            )}
          >
            <ShieldCheck size={20} className="shrink-0" />
            {!collapsed && <span className="text-sm font-medium">System</span>}
          </Link>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-slate-100 p-4 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-500 transition-all hover:bg-slate-50",
            collapsed && "justify-center",
          )}
        >
          <Settings size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>

        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-rose-500 transition-all hover:bg-rose-50",
            collapsed && "justify-center",
          )}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
