import FormCreateNote from "@/features/notes/FormCreateNote";
import { NoteCard } from "@/features/notes/NoteCard";
import NotesList from "@/features/notes/NotesList";
import { getNotes } from "@/lib/actions/user/notes";
import { Filter, LayoutGrid, ListIcon, Pin, Search } from "lucide-react";
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

export default async function NotesPage() {
  const { data: notes } = await getNotes({});

  const pinnedNotes = notes.filter(
    (n) => n.pinnedAt !== null && n.openedAt !== null,
  );
  const openNotes = notes.filter(
    (n) => n.openedAt !== null && n.pinnedAt === null,
  );
  const closedNotes = notes.filter((n) => n.openedAt === null);

  return (
    <main className="flex-1 flex flex-col gap-6 p-4 md:p-6">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Workspace
          </h1>
          <p className="text-slate-500 font-medium">
            {notes.length} total notes • Organize your thoughts and tasks
          </p>
        </div>

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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-10 items-start">
        {/* Sidebar: All Notes List */}
        <aside className="md:sticky top-6 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Inventory
            </h3>
            <button className="text-slate-400 hover:text-indigo-600 transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
          <NotesList notes={closedNotes} />
        </aside>

        <div className="flex-1 space-y-12">
          {/* SECTION 1: PINNED (Bento Spotlight) */}
          {pinnedNotes.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <Pin className="h-4 w-4 text-amber-600 fill-amber-600" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-amber-700">
                  Priority
                </h2>
              </div>

              <div className="p-6 rounded-3xl bg-linear-to-br from-amber-50/50 to-orange-50/30 border border-amber-100/50 shadow-[0_20px_50px_rgba(251,191,36,0.08)]">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {pinnedNotes.map((note) => (
                    <NoteCard key={note.id} note={note} /> //isPinnedStyle
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Workspace: Open Notes */}
          <section className="flex-1 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Active Focus
                <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {openNotes.length}
                </span>
              </h2>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="p-1.5 rounded-md bg-white shadow-sm text-indigo-600">
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600">
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {openNotes.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {openNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                <div className="h-20 w-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-slate-200" />
                </div>
                <h3 className="text-slate-900 font-semibold">
                  No active notes
                </h3>
                <p className="text-slate-500 text-sm max-w-60 text-center mt-1">
                  Select a note from the sidebar or create a new one to start
                  working.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
