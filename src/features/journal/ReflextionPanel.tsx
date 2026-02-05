// components/journal/reflection-panel.tsx

"use client";

import { useState } from "react";
import { acrylic } from "@/lib/shared";

export function ReflectionPanel() {
  const [open, setOpen] = useState(false);

  return (
    <section className={`${acrylic} rounded-2xl`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 text-left text-sm font-medium text-indigo-900"
      >
        {open ? "▾ Reflection" : "▸ Reflection (optional)"}
      </button>

      {open && (
        <div className="px-4 pb-4">
          <textarea
            placeholder="What went well today?"
            className="w-full resize-none bg-transparent outline-none text-sm text-indigo-950 placeholder:text-indigo-700/50"
            rows={4}
          />
        </div>
      )}
    </section>
  );
}
