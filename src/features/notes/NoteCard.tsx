"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Pin,
  X,
  Trash2,
  CheckCircle2,
  Loader2,
  Tag as TagIcon,
  FileText,
  Plus,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  updateNote,
  deleteNote,
  togglePinNote,
} from "@/lib/actions/user/notes";
import { cn } from "@/lib/utils";
import { Note } from "../../../generated/prisma/client";
import { TagSelector } from "./TagSelector";
import { useUser } from "@/context/UserContext";
import { NoteCardSkeleton } from "../skeletons/NoteCardSkeleton";
import FormCreateNote from "./FormCreateNote";

// { note }: { note: Note }
export function NoteCard({ hasNotes }: { hasNotes: boolean }) {
  const { openNote: note } = useUser();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note?.title ?? "");
  const [details, setDetails] = useState(note?.details ?? "");

  // Track whether the user actually edited anything
  const hasUserEditedRef = useRef(false);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hasUserEditedRef.current = true;
    setTitle(e.target.value);
  };

  const onDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    hasUserEditedRef.current = true;
    setDetails(e.target.value);
  };

  const [isSaving, setIsSaving] = useState(false);

  const [date, setDate] = useState("updated");

  const debouncedTitle = useDebounce(title, 800);
  const debouncedDetails = useDebounce(details, 800);

  useEffect(() => {
    setTitle(note?.title ?? "");
    setDetails(note?.details ?? "");
    setEditing(false);
  }, [note?.id]);

  // Capture the note ID at debounce time and reject mismatches.
  const noteIdRef = useRef(note?.id);

  useEffect(() => {
    noteIdRef.current = note?.id;

    // Reset edit intent when switching notes
    hasUserEditedRef.current = false;
  }, [note?.id]);

  useEffect(() => {
    if (!hasUserEditedRef.current) return;

    if (
      debouncedTitle === (note?.title ?? "") &&
      debouncedDetails === (note?.details ?? "")
    ) {
      return;
    }

    const currentNoteId = note?.id ?? "";

    const save = async () => {
      setIsSaving(true);

      try {
        // ❌ Abort if note switched
        if (noteIdRef.current !== currentNoteId) return;

        const formData = new FormData();
        formData.append("id", currentNoteId);
        formData.append("title", debouncedTitle);
        formData.append("details", debouncedDetails);

        await updateNote(formData);
      } finally {
        setTimeout(() => setIsSaving(false), 400);
      }
    };

    save();
  }, [debouncedTitle, debouncedDetails, note?.id]);

  async function handleDelete() {
    try {
      if (confirm("Are you sure you want to delete this note?")) {
        await deleteNote(note?.id ?? "");
      }
    } catch {}
  }
  // const handleClose = (note: Note) => {
  //   startTransition(async () => {
  //     try {
  //       await toggleOpenNote({ id: note.id, openedAt: null });
  //     } catch (error) {
  //       console.error("Failed to open note:", error);
  //     }
  //   });
  // };

  // Inside NoteCard component...
  const [tags, setTags] = useState<string[]>(["Project", "Idea"]); // Mocked initial tags

  const handleAddTag = async (newTag: string) => {
    if (tags.includes(newTag)) return;

    const updatedTags = [...tags, newTag];
    setTags(updatedTags); // Instant UI update

    // Sync to DB
    try {
      const formData = new FormData();
      formData.append("id", note?.id ?? "");
      formData.append("tags", JSON.stringify(updatedTags));
      await updateNote(formData); // Use your existing updateNote action
    } catch {
      setTags(tags); // Rollback on failure
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = tags.filter((t) => t !== tagToRemove);
    setTags(updatedTags);

    try {
      const formData = new FormData();
      formData.append("id", note?.id ?? "");
      formData.append("tags", JSON.stringify(updatedTags));
      await updateNote(formData);
    } catch {
      setTags(tags);
    }
  };
  const baseText =
    "text-sm leading-relaxed text-slate-600 whitespace-pre-wrap break-words";

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <NoteCardSkeleton />;
  } else if (!note) {
    return (
      <div
        className={cn(
          "relative flex-1 flex flex-col items-center justify-center rounded-2xl border",
          "bg-white/90 backdrop-blur-xl border-slate-200 shadow-sm",
          "px-6 py-10 text-center",
        )}
      >
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
          <FileText className="h-6 w-6" />
        </div>

        {/* Message */}
        <p className="text-sm font-medium text-slate-700 max-w-xs">
          {hasNotes
            ? "Select a note from the sidebar or create a new one to start writing."
            : "You don’t have any notes yet."}
        </p>

        {/* Sub message */}
        <p className="text-xs text-slate-500 max-w-xs mb-4">
          {hasNotes
            ? "Your notes will appear here when opened."
            : "Create your first note to capture ideas, tasks, or thoughts."}
        </p>

        {/* Action (only when empty) */}
        {!hasNotes && <FormCreateNote />}
      </div>
    );
  } else
    return (
      <div
        className={cn(
          "group relative flex-1 flex flex-col rounded-2xl border bg-white/90 backdrop-blur-xl transition-all duration-300",
          "shadow-sm hover:shadow-md border-slate-200 focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-500/5",
        )}
      >
        <button
          onClick={() =>
            setDate((curr) => (curr === "created" ? "updated" : "created"))
          }
          className="mt-4 text-sm text-zinc-600 font-medium"
        >
          {date === "created"
            ? `Created On ${note?.createdAt?.toDateString()}`
            : `Updated On ${note?.updatedAt?.toDateString()}`}
        </button>
        {/* Hidden Utility Bar (Shows on Hover) */}
        <div className="absolute -top-3 right-2 flex items-center gap-1.5 md:opacity-0 opacity-100 group-hover:opacity-100 transition-all duration-200 z-10 md:translate-y-1 translate-y-0 group-hover:translate-y-0">
          <button
            onClick={() =>
              togglePinNote({
                id: note?.id ?? "",
                pinnedAt: !!note?.pinnedAt ? null : new Date(),
              })
            }
            className={cn(
              "p-2 rounded-xl shadow-lg border border-slate-200 bg-white transition-colors hover:bg-slate-50",
              note?.pinnedAt ? "text-amber-500" : "text-slate-400",
            )}
          >
            <Pin className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl shadow-lg border border-slate-200 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {/* <button
          onClick={() => toggleOpenNote({ id: note.id, openedAt: null })}
          className="p-2 rounded-xl shadow-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button> */}
        </div>

        <div className="p-6 flex flex-col gap-4">
          <input
            value={title}
            onChange={onTitleChange}
            placeholder="Untitled Note"
            className="text-xl font-bold text-slate-800 placeholder:text-slate-300 bg-transparent outline-none"
          />

          <div
            className="min-h-24 cursor-text"
            onClick={() => setEditing(true)}
          >
            {editing ? (
              <textarea
                autoFocus
                value={details}
                onChange={onDetailsChange}
                onBlur={() => setEditing(false)}
                rows={5}
                className={cn(
                  "w-full bg-transparent outline-none resize-none",
                  baseText,
                )}
              />
            ) : (
              <div
                className={cn(
                  "prose prose-sm prose-slate max-w-none",
                  baseText,
                  // ⬇️ REMOVE prose spacing differences
                  "prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0",
                )}
              >
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
            <TagSelector activeTags={tags} onAdd={handleAddTag} />
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
