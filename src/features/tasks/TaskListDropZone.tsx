"use client";

import { moveTask } from "@/lib/actions/user/tasks";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import toast from "react-hot-toast";
import { ListCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import DraggableUserLists from "./DraggableUserLists";

export function TaskListsDropZone({
  taskLists,
  children,
}: {
  taskLists: { id: string; name: string }[];
  children: React.ReactNode;
}) {
  const [showUserLists, setShowUserLists] = useState(true);
  const [{ x, y }, setCoordinates] = useState({ x: 0, y: 0 });

  function onDragEnd(event: DragEndEvent) {
    const { active, over, delta } = event;

    if (active.id === "sidebar") {
      setCoordinates((prev) => ({
        x: prev.x + delta.x,
        y: prev.y + delta.y,
      }));
    }

    if (!over) return;

    const activeType = getDragType(active.id as string);

    // 🧠 Task → list
    if (activeType === "task" && over.id.toString().startsWith("list:")) {
      const taskId = active.id.toString().replace("task:", "");
      const listId = over.id.toString().replace("list:", "");

      const formData = new FormData();
      formData.append("id", taskId);
      formData.append("taskListId", listId);

      const handleMove = async (formData: FormData) => {
        try {
          const res = await moveTask(formData);
          if (res.status === 200) {
            toast.success("Task moved");
          } else {
            toast.error("Failed to add task to this collection");
          }
        } catch {
          toast.error("Network synchronization failed");
        }
      };

      handleMove(formData);
    }

    // 🧠 Sidebar drop (optional future snap logic)
    if (activeType === "sidebar") {
      // nothing for now
    }
  }

  function getDragType(id: string) {
    if (id.startsWith("task:")) return "task";
    if (id === "sidebar") return "sidebar";
    return null;
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 relative group/dropzone">
        {!showUserLists && (
          <div className="absolute -top-3 -left-12 flex items-center gap-1.5 opacity-0 group-hover/dropzone:opacity-100 transition-all duration-200 z-70 translate-y-1 group-hover/dropzone:translate-y-0">
            <button
              onClick={() => setShowUserLists(true)}
              className="p-2 rounded-xl shadow-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <ListCheck size={20} />
            </button>
          </div>
        )}

        {/* Lists */}
        <DraggableUserLists
          taskLists={taskLists}
          showUserLists={showUserLists}
          setShowUserLists={setShowUserLists}
          coordinates={{ x, y }}
        />

        <div className={cn("flex-1 transition-all duration-200")}>
          {children}
        </div>
      </div>
    </DndContext>
  );
}
