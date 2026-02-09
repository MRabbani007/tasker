"use client";

import { useEffect } from "react";

interface ShortcutOptions {
  key: string;
  cmd?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function useCommandShortcut(
  { key, cmd = true, shift = false, alt = false }: ShortcutOptions,
  callback: () => void,
) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInput) return;

      const isCmd = cmd && (e.metaKey || e.ctrlKey);

      if (
        isCmd &&
        e.key.toLowerCase() === key.toLowerCase() &&
        e.shiftKey === shift &&
        e.altKey === alt
      ) {
        e.preventDefault();
        callback();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, cmd, shift, alt, callback]);
}
