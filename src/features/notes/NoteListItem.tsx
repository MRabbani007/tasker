"use client";

import { Note } from "../../../generated/prisma/client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { normalizeDate } from "@/lib/helpers";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";

export default function NoteListItem({
  note,
  disabled,
}: {
  note: Note;
  disabled?: boolean;
}) {
  const { openNote, setOpenNote } = useUser();
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    startTransition(async () => {
      try {
        setOpenNote(note);
        // await toggleOpenNote({ id: note.id, openedAt: new Date() });
      } catch (error) {
        console.error("Failed to open note:", error);
      }
    });
  };

  const lines = note.details?.split("\n").filter(Boolean) ?? [];

  const title = note.title?.trim() || lines[0]?.slice(0, 80) || "New Note";

  const subtitle = note.title?.trim() ? lines[0] : lines[1];

  const dateLabel = format(
    normalizeDate(note?.updatedAt) ?? new Date(),
    "MMM d",
  );

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      key={note.id}
      disabled={disabled}
      onClick={() => handleOpen()}
      className={cn(
        "w-full group py-3 px-4 flex items-center justify-between text-left",
        "hover:bg-zinc-100 transition-all",
        "hover:bg-indigo-50/50 disabled:opacity-70",
      )}
    >
      <div className="flex-1 flex flex-col gap-0.5 pr-2 min-w-0">
        <p
          className={cn(
            "text-sm font-medium text-slate-700 group-hover:text-indigo-700",
            "overflow-hidden whitespace-nowrap text-ellipsis pr-2",
            openNote?.id === note.id ? "text-indigo-500" : "text-slate-700",
          )}
        >
          {title}
        </p>

        {subtitle && (
          <p className="text-xs text-zinc-500 overflow-hidden whitespace-nowrap text-ellipsis pr-2">
            {subtitle}
          </p>
        )}

        <p className="text-[11px] text-zinc-400 mt-0.5 pr-2">{dateLabel}</p>
      </div>

      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
      ) : (
        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
      )}
    </motion.button>
  );
}
