"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { pinTaskList } from "@/lib/actions/user/tasklists";
import { cn } from "@/lib/utils";
import { Loader2, Pin } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function FormPinTaskList({
  isPinned,
  id,
}: {
  isPinned: boolean;
  id: string;
}) {
  const [pinned, setPinned] = useState(isPinned);
  const [saving, setSaving] = useState(false);

  const debouncedPinned = useDebounce(pinned, 1000);

  useEffect(() => {
    const handleUpdate = async () => {
      setSaving(true);

      const formData = new FormData();
      formData.append("id", id);
      formData.append("pinnedAt", String(debouncedPinned ? new Date() : null));

      await pinTaskList(formData);

      setSaving(false);
    };

    if (debouncedPinned !== isPinned) {
      handleUpdate();
    }
  }, [debouncedPinned]);

  return (
    <button
      title={isPinned ? "Unpin list" : "Pin list"}
      disabled={saving}
      onClick={() => setPinned((curr) => !curr)}
      className={cn(
        "rounded-lg p-2 transition",
        isPinned
          ? "text-sky-700 bg-sky-100"
          : "text-zinc-500 hover:bg-zinc-100",
      )}
    >
      {saving ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Pin size={16} />
      )}
    </button>
  );
}
