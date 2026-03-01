"use client";

import UserFormTrigger from "@/components/UserFormTrigger";
import { Search, Plus, Hash, Layers } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

const types = [
  { label: "All Types", value: "" },
  { label: "Task", value: "task" },
  { label: "Note", value: "note" },
  { label: "Highlight", value: "highlight" },
  { label: "Routine", value: "routine" },
  { label: "Reflection", value: "reflection" },
];

export function JournalHeader({ subjects }: { subjects: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    function loadValues() {
      setSearch(searchParams.get("q") ?? "");
      setType(searchParams.get("type") ?? "");
      setSubject(searchParams.get("subject") ?? "");
    }

    loadValues();
  }, [searchParams]);

  const updateUrl = useCallback(
    (values: { q?: string; type?: string; subject?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (values.q !== undefined) {
        values.q ? params.set("q", values.q) : params.delete("q");
      }
      if (values.type !== undefined) {
        values.type ? params.set("type", values.type) : params.delete("type");
      }
      if (values.subject !== undefined) {
        values.subject
          ? params.set("subject", values.subject)
          : params.delete("subject");
      }

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    updateUrl({ q: search, type, subject });
  }

  const debouncedSearch = useDebounce(search, 500);
  const debouncedType = useDebounce(type, 500);
  const debouncedSubject = useDebounce(subject, 500);

  useEffect(() => {
    updateUrl({ q: search, type, subject });
  }, [debouncedSearch, debouncedType, debouncedSubject]);

  return (
    <header className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title Section: Bento-inspired spacing */}
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">
            Daily Journal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Capture your thoughts, one block at a time.
          </p>
        </div>

        {/* Global Action Button */}
        <UserFormTrigger type="container" value="CREATE_JOURNAL_ENTRY">
          <button className="group relative flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95 transition-all overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={20} strokeWidth={3} />
            <span>New Entry</span>
          </button>
        </UserFormTrigger>
      </div>

      {/* Control Bar: 2026 Glassmorphism + Bento Layout */}
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-12 gap-3 p-2 rounded-4xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl"
      >
        {/* Search - Spans 6 columns */}
        <div className="md:col-span-6 relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search your mind..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-none ring-1 ring-slate-200/50 dark:ring-slate-800/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Subject Filter - Spans 3 columns */}
        <div className="md:col-span-3 relative">
          <Hash
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={18}
          />
          <select
            value={subject}
            onChange={(e) => e.target.value}
            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-none ring-1 ring-slate-200/50 dark:ring-slate-800/50 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <option value="">All Subjects</option>
            {subjects?.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Entry Type - Spans 3 columns */}
        <div className="md:col-span-3 relative">
          <Layers
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={18}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-none ring-1 ring-slate-200/50 dark:ring-slate-800/50 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            {types.map((item) => (
              <option key={item.label} value={item?.value}>
                {item?.label}
              </option>
            ))}
          </select>
        </div>
      </form>
    </header>
  );
}
