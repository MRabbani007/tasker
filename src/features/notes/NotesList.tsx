"use client";

import React from "react";
import { Note } from "../../../generated/prisma/client";
import { toggleOpenNote } from "@/lib/actions/user/notes";

export default function NotesList({ notes }: { notes: Note[] }) {
  const handleOpen = async (note: Note) => {
    try {
      await toggleOpenNote({ id: note.id, openedAt: new Date() });
    } catch {}
  };

  if (notes.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-amber-800/10 border border-amber-600 w-52 overflow-clip">
      <h2 className="font-semibold py-2 px-4 bg-amber-800/30">My Notes</h2>
      <div className="flex flex-col">
        {notes.map((note) => (
          <div
            key={note.id}
            className="py-2 px-4 hover:bg-zinc-200 duration-200 rounded-md"
            onClick={() => handleOpen(note)}
          >
            {note.title}
          </div>
        ))}
      </div>
    </section>
  );
}
