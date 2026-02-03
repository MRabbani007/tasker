"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Pin, X } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { toggleOpenNote, updateNote } from "@/lib/actions/user/notes";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

type Note = {
  id: string;
  title?: string | null;
  details?: string | null;
  pinnedAt?: Date | null;
  openedAt?: Date | null;
};

export function NoteCard({ note }: { note: Note }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title ?? "");
  const [details, setDetails] = useState(note.details ?? "");

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedDetails = useDebounce(details, 1000);

  const debouncedSave = useDebouncedCallback(() => {}, 600);

  useEffect(() => {
    const handleSave = async () => {
      try {
        const formData = new FormData();
        formData.append("id", note.id);
        formData.append("title", title);
        formData.append("details", details);

        await updateNote(formData);
      } catch {}
    };

    handleSave();
  }, [debouncedTitle, debouncedDetails]);

  const handleClose = async (note: Note) => {
    try {
      alert("closing");
      await toggleOpenNote({ id: note.id, openedAt: null });
    } catch {}
  };

  const contentClass =
    "w-full text-sm leading-relaxed text-foreground whitespace-pre-wrap";

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  return (
    <div
      className={cn(
        "group relative rounded-2xl border",
        "bg-muted/30 backdrop-blur",
        "p-4 shadow-sm transition",
        "hover:shadow-md",
        editing && "ring-2 ring-primary/30",
      )}
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
        />
        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button className="rounded-md p-1 hover:bg-muted">
            <Pin
              className={cn(
                "h-4 w-4",
                note.pinnedAt ? "text-yellow-500" : "text-muted-foreground",
              )}
            />
          </button>

          {note.openedAt && (
            <button
              onClick={() => handleClose(note)}
              className="rounded-md p-1 hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      {/* Content */}
      <div
        className="relative cursor-text min-h-20"
        onClick={() => setEditing(true)}
      >
        {editing ? (
          <textarea
            autoFocus
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
              debouncedSave();
            }}
            onBlur={() => setEditing(false)}
            rows={4}
            className={cn(
              contentClass,
              "resize-none bg-transparent outline-none",
              "",
            )}
          />
        ) : (
          <div className={cn(contentClass, "prose prose-sm max-w-none")}>
            <ReactMarkdown>{details || "_Write something…_"}</ReactMarkdown>
          </div>
        )}
      </div>
      {editing && (
        <div className="absolute inset-0 rounded-2xl ring-1 ring-primary/20 pointer-events-none" />
      )}
    </div>
  );
}
