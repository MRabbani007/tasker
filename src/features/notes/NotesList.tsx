"use client";

import React, { useEffect, useState } from "react";
import { Note } from "../../../generated/prisma/client";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pin, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import NoteListItem from "./NoteListItem";
import { format, isToday, isYesterday } from "date-fns";
import NotesGroup from "./NotesGroup";
import { normalizeDate } from "@/lib/helpers";
import { useDebounce } from "@/hooks/useDebounce";
import { useUser } from "@/context/UserContext";
import { useLastOpenedNote } from "@/hooks/useLastOpenNote";

const MOBILE_BREAKPOINT = 768;

export function getGroupLabel(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  return format(date, "yyyy");
}

export function groupNotesByDate(notes: Note[]) {
  const groups = new Map<string, Note[]>();

  for (const note of notes) {
    const label = getGroupLabel(normalizeDate(note.createdAt) ?? new Date());

    if (!groups.has(label)) {
      groups.set(label, []);
    }

    groups.get(label)!.push(note);
  }

  return Array.from(groups.entries()).map(([title, notes]) => ({
    title,
    notes: notes.sort(
      (a, b) => +new Date(b.createdAt ?? "") - +new Date(a.createdAt ?? ""),
    ),
  }));
}

export default function NotesList({
  notes,
  count,
}: {
  notes: Note[];
  count: number;
}) {
  const { openNote, setOpenNote } = useUser();

  const { openNote: persistentOpenNote } = useLastOpenedNote(
    notes,
    setOpenNote,
    500,
  );

  useEffect(() => {
    if (openNote?.id) {
      persistentOpenNote(openNote);
    }
  }, [openNote, persistentOpenNote]);

  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("notes-sidebar-open");

      if (saved !== null) {
        setOpen(saved === "true");
        setHydrated(true);
        return;
      }

      if (window.innerWidth < MOBILE_BREAKPOINT) {
        setOpen(false);
      }

      setHydrated(true);
    };

    load();
  }, []);

  // load open/closed sidebar status
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("notes-sidebar-open", String(open));
  }, [open, hydrated]);

  useEffect(() => {
    function updateNotes() {
      if (!debouncedSearch?.trim) {
        setFilteredNotes(notes);
      } else {
        const lower = debouncedSearch.toLowerCase();

        const temp = notes.filter(
          (item) =>
            item.title?.toLowerCase()?.includes(lower) ||
            item?.details?.toLocaleLowerCase()?.includes(lower),
        );

        setFilteredNotes(temp);
      }
    }

    updateNotes();
  }, [debouncedSearch, notes]);

  const pinnedNotes = filteredNotes.filter((n) => n.pinnedAt !== null);

  const unpinnedNotes = filteredNotes.filter((n) => n.pinnedAt === null);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "absolute top-20 translate-y-0 z-50",
          "rounded-r-lg border border-l-0 border-zinc-200 bg-white p-1.5 shadow",
          "hover:bg-zinc-100 transition",
          open ? "left-64" : "left-0",
        )}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      <aside
        className={cn(
          "relative border-r border-zinc-200 bg-zinc-50 transition-all duration-300 inline-flex",
          open ? "w-64" : "w-0",
          !hydrated && "invisible",
        )}
      >
        <div
          className={cn(
            "overflow-hidden transition-opacity duration-200 p-4 flex-1 flex flex-col gap-4",
            open ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex items-center gap-2 px-1">
            <StickyNote className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              My Notes
            </h2>
            <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
              {count}
            </span>
          </div>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="py-2 px-4 rounded-xl bg-white shadow-sm"
          />
          {pinnedNotes?.length !== 0 && (
            <>
              <div className="flex items-center gap-2 px-3 py-1">
                <Pin className="w-3 h-3 text-zinc-500" />
                <span className="text-xs font-semibold text-zinc-500 uppercase">
                  Pinned
                </span>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-xl overflow-hidden shadow-sm shadow-indigo-100/50">
                <div className="flex flex-col divide-y divide-slate-100">
                  <AnimatePresence mode="popLayout">
                    {pinnedNotes.map((note) => (
                      <NoteListItem key={note.id} note={note} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
          {groupNotesByDate(unpinnedNotes).map((group) => (
            <NotesGroup
              key={group.title}
              title={group.title}
              notes={group.notes}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
