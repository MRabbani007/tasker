import FormCreateNote from "@/features/notes/FormCreateNote";
import { NoteCard } from "@/features/notes/NoteCard";
import NotesList from "@/features/notes/NotesList";
import { getNotes } from "@/lib/actions/user/notes";
import { extractFilters } from "@/lib/helpers";
import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Capture ideas, thoughts, and quick notes in a distraction-free writing space.",
  openGraph: {
    title: "Notes · Tasker",
    description:
      "Write, edit, and organize notes with a clean and focused experience.",
  },
};

const FILTER_MAP = {
  query: "query",
} as const;

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const filters: TaskFilters = extractFilters(resolvedSearchParams, FILTER_MAP);

  const { data: notes, count = 0 } = await getNotes({ filters });

  return (
    <main className="flex-1 flex items-stretch relative">
      {/* Sidebar: All Notes List */}
      <NotesList notes={notes} count={count} />
      <div className="flex-1 flex flex-col gap-6 p-4 md:p-6">
        {/* Dynamic Header */}
        <header className="flex md:items-end justify-between gap-4">
          <div className="space-y-1"></div>

          <div className="flex items-center gap-3">
            {/* Subtle Search Bar */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search notes..."
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all"
              />
            </div>
            <FormCreateNote />
          </div>
        </header>

        <NoteCard hasNotes={false} />
      </div>
    </main>
  );
}
