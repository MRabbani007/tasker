"use client";

import { AnimatePresence } from "framer-motion";
import { Note } from "../../../generated/prisma/client";
import NoteListItem from "./NoteListItem";

export default function NotesGroup({
  title,
  notes,
}: {
  title: string;
  notes: Note[];
}) {
  if (notes.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 py-1 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
        {title}
      </p>
      <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-xl overflow-hidden shadow-sm shadow-indigo-100/50">
        <div className="flex flex-col divide-y divide-slate-100">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <NoteListItem key={note.id} note={note} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
