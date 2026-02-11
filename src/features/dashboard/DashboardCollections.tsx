"use client";

import { ListFilter, Plus, ChevronRight, Hash } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserList {
  id: string;
  title: string | null;
  color?: string;
  _count: { tasks: number };
}

export default function ListCollectionsCard({ lists }: { lists: UserList[] }) {
  return (
    <div className="md:col-span-2 lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <ListFilter size={18} className="text-indigo-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
            My Lists
          </h3>
        </div>
        <button
          title="Create New List"
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* List Items */}
      <div className="flex-1 space-y-3">
        {lists.length > 0 ? (
          lists.slice(0, 3).map((list) => (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group"
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm",
                  list.color || "bg-slate-400",
                )}
              >
                <Hash size={16} strokeWidth={3} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                  {list.title}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {list._count.tasks}{" "}
                  {list._count.tasks === 1 ? "Task" : "Tasks"}
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase">
              No lists yet
            </p>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <Link
        href="/lists"
        className="mt-6 flex items-center justify-center gap-2 py-3 w-full rounded-xl bg-slate-50 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100"
      >
        View All Collections <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function ArrowRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  );
}
