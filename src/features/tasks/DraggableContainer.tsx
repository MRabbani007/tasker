"use client";

import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

export default function DraggableContainer({
  id,
  disabled,
  children,
}: {
  id: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${id}`,
      disabled,
    });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
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
