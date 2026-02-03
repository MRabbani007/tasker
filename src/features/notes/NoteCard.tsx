"use client";

import React, { useEffect, useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import {
  Pin,
  X,
  Trash2,
  CheckCircle2,
  Loader2,
  Tag as TagIcon,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  toggleOpenNote,
  updateNote,
  deleteNote,
  togglePinNote,
} from "@/lib/actions/user/notes";
import { cn } from "@/lib/utils";
import { Note } from "../../../generated/prisma/client";
import { TagSelector } from "./TagSelector";

export function NoteCard({ note }: { note: Note }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title ?? "");
  const [details, setDetails] = useState(note.details ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  const debouncedTitle = useDebounce(title, 800);
  const debouncedDetails = useDebounce(details, 800);

  useEffect(() => {
    if (debouncedTitle === note.title && debouncedDetails === note.details)
      return;
    const handleSave = async () => {
      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.append("id", note.id);
        formData.append("title", debouncedTitle);
        formData.append("details", debouncedDetails);
        await updateNote(formData);
      } finally {
        setTimeout(() => setIsSaving(false), 600);
      }
    };
    handleSave();
  }, [debouncedTitle, debouncedDetails, note.id]);

  const handleClose = (note: Note) => {
    startTransition(async () => {
      try {
        await toggleOpenNote({ id: note.id, openedAt: null });
      } catch (error) {
        console.error("Failed to open note:", error);
      }
    });
  };

  // Inside NoteCard component...
  const [tags, setTags] = useState<string[]>(["Project", "Idea"]); // Mocked initial tags

  const handleAddTag = async (newTag: string) => {
    if (tags.includes(newTag)) return;

    const updatedTags = [...tags, newTag];
    setTags(updatedTags); // Instant UI update

    // Sync to DB
    try {
      const formData = new FormData();
      formData.append("id", note.id);
      formData.append("tags", JSON.stringify(updatedTags));
      await updateNote(formData); // Use your existing updateNote action
    } catch (error) {
      setTags(tags); // Rollback on failure
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = tags.filter((t) => t !== tagToRemove);
    setTags(updatedTags);

    try {
      const formData = new FormData();
      formData.append("id", note.id);
      formData.append("tags", JSON.stringify(updatedTags));
      await updateNote(formData);
    } catch (error) {
      setTags(tags);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-white/90 backdrop-blur-xl transition-all duration-300",
        "shadow-sm hover:shadow-md border-slate-200 focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-500/5",
      )}
    >
      {/* Hidden Utility Bar (Shows on Hover) */}
      <div className="absolute -top-3 -right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 translate-y-1 group-hover:translate-y-0">
        <button
          onClick={() =>
            togglePinNote({
              id: note.id,
              pinnedAt: !!note.pinnedAt ? null : new Date(),
            })
          }
          className={cn(
            "p-2 rounded-xl shadow-lg border border-slate-200 bg-white transition-colors hover:bg-slate-50",
            note.pinnedAt ? "text-amber-500" : "text-slate-400",
          )}
        >
          <Pin className="h-4 w-4" />
        </button>
        <button
          onClick={() => deleteNote(note.id)}
          className="p-2 rounded-xl shadow-lg border border-slate-200 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => toggleOpenNote({ id: note.id, openedAt: null })}
          className="p-2 rounded-xl shadow-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
          className="text-xl font-bold text-slate-800 placeholder:text-slate-300 bg-transparent outline-none"
        />

        <div className="min-h-25 cursor-text" onClick={() => setEditing(true)}>
          {editing ? (
            <textarea
              autoFocus
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              onBlur={() => setEditing(false)}
              className="w-full text-sm leading-relaxed text-slate-600 bg-transparent outline-none resize-none"
              rows={5}
            />
          ) : (
            <div className="prose prose-sm prose-slate max-w-none text-slate-600">
              <ReactMarkdown>
                {details || "_Click to write details..._"}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Modern Footer with Tags & Status */}
      <div className="mt-auto px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/30 rounded-b-2xl">
        <div className="flex items-center gap-2 overflow-x-aut no-scrollbar">
          <TagIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {tags.map((tag) => (
            <span
              key={tag}
              className="group/tag flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100/50"
            >
              {tag}
              <button onClick={() => handleRemoveTag(tag)}>
                <X className="h-2.5 w-2.5 opacity-0 group-hover/tag:opacity-100 transition-opacity hover:text-red-500" />
              </button>
            </span>
          ))}

          {/* Integrated TagSelector */}
          <TagSelector
            activeTags={tags}
            onAdd={handleAddTag}
            onRemove={handleRemoveTag}
          />
        </div>

        <div className="flex items-center shrink-0">
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">
              <Loader2 className="h-3 w-3 animate-spin" /> Saving
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-500 uppercase tracking-tighter">
              <CheckCircle2 className="h-3 w-3" /> Synced
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
