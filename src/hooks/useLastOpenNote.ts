"use client";

import { useEffect, useRef } from "react";
import { Note } from "../../generated/prisma/client";

const STORAGE_KEY = "last-opened-note-id";

export function useLastOpenedNote(
  notes: Note[],
  setOpenNote: (note: Note | null) => void,
  debounceMs = 500,
) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // 1️⃣ Restore last opened note on load / notes change
  useEffect(() => {
    if (!notes.length) return;

    const savedId = localStorage.getItem(STORAGE_KEY);
    if (!savedId) return;

    const found = notes.find((n) => n.id === savedId);

    if (found) {
      setOpenNote(found);
    } else {
      // Stale ID cleanup
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [notes, setOpenNote]);

  // 2️⃣ Persist last opened note (debounced)
  const openNote = (note: Note | null) => {
    if (!note) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, note.id);
    }, debounceMs);
  };

  // 3️⃣ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return { openNote };
}
