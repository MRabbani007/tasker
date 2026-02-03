"use client";

import { createNote } from "@/lib/actions/user/notes";
import React from "react";

export default function FormCreateNote() {
  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    await createNote();
  };

  return (
    <form onSubmit={onSubmit}>
      <button className="rounded-lg bg-primary px-4 py-2 text-white bg-amber-700">
        + Add note
      </button>
    </form>
  );
}
