"use client";

import React, { useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Sparkles, SquarePen } from "lucide-react";
import { createNote } from "@/lib/actions/user/notes";
import { cn } from "@/lib/utils";
import { useCommandShortcut } from "@/hooks/useCommandShortcut";

export default function FormCreateNote() {
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useCommandShortcut({ key: "a", cmd: true, shift: true }, () => {
    formRef.current?.requestSubmit();
  });

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    await createNote();
  };

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 overflow-hidden",
          "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300",
          "hover:bg-indigo-700 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed",
        )}
      >
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />

        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden md:inline">Creating...</span>
          </>
        ) : (
          <>
            <SquarePen className="h-4 w-4 stroke-3" />
            <span className="hidden md:inline">New Note</span>
            <Sparkles className="h-3 w-3 text-indigo-200 ml-1 hidden sm:block" />
          </>
        )}
      </button>
    </form>
  );
}
