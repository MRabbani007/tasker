"use client";

import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DropList({
  list,
}: {
  list: { id: string; name: string };
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `list:${list.id}`,
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTaskList = searchParams.get("taskList");
  const isActive = activeTaskList === list.id;

  function handleClick() {
    const params = new URLSearchParams(searchParams.toString());

    if (isActive) {
      params.delete("taskList"); // toggle off
    } else {
      params.set("taskList", list.id);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={cn(
        "relative z-10 rounded-lg border shadow-sm p-3 font-medium cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:border-zinc-30 hover:-translate-y-0.5 hover:border-blue-400", // Added slight lift
        isOver ? "bg-blue-50 border-blue-400 scale-[1.02] shadow-inner" : "",
        isActive
          ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200"
          : "bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900",
      )}
    >
      {list.name}
    </div>
  );
}
