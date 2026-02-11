"use client";

import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

export function DraggableTask({
  task,
  children,
}: {
  task: { id: string };
  children: React.ReactNode;
}) {
  const { showUserLists } = useUser();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task:${task.id}`,
      disabled: !showUserLists,
    });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: isDragging ? 100 : undefined,
        position: isDragging ? ("relative" as const) : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        " flex",
        isDragging ? "opacity-80 cursor-grabbing" : "cursor-grab",
      )}
    >
      {children}
    </div>
  );
}
