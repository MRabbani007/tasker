"use client";

import React, { useTransition } from "react";
import { Note } from "../../../generated/prisma/client";
import { toggleOpenNote } from "@/lib/actions/user/notes";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, StickyNote } from "lucide-react";

export default function NotesList({ notes }: { notes: Note[] }) {
  const [isPending, startTransition] = useTransition();

  const handleOpen = (note: Note) => {
    startTransition(async () => {
      try {
        await toggleOpenNote({ id: note.id, openedAt: new Date() });
      } catch (error) {
        console.error("Failed to open note:", error);
      }
    });
  };

  if (notes.length === 0) {
    return null;
  }

  return (
    <section className="w-64 flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <StickyNote className="w-4 h-4 text-indigo-500" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          My Notes
        </h2>
        <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
          {notes.length}
        </span>
      </div>

      <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-xl overflow-hidden shadow-sm shadow-indigo-100/50">
        <div className="flex flex-col divide-y divide-slate-100">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <motion.button
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                key={note.id}
                disabled={isPending}
                onClick={() => handleOpen(note)}
                className="group flex items-center justify-between py-3 px-4 text-left transition-all hover:bg-indigo-50/50 disabled:opacity-70"
              >
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 truncate mr-2">
                  {note.title}
                </span>

                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
