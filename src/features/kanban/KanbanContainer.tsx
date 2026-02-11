"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { MoreHorizontal, GripVertical, Calendar, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  softDeleteTaskAction,
  updateTaskStatusAction,
} from "@/lib/actions/user/tasks";
import { Task } from "../../../generated/prisma/client";

const COLUMNS = [
  {
    id: "NEW",
    status: "",
    title: "New Tasks",
    color: "bg-slate-100 text-slate-600",
  },
  {
    id: "TODO",
    status: "TODO",
    title: "To Do",
    color: "bg-slate-100 text-slate-600",
  },
  {
    id: "IN_PROGRESS",
    status: "IN_PROGRESS",
    title: "In Progress",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    id: "DONE",
    status: "DONE",
    title: "Completed",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function KanbanContainer({
  initialTasks = [],
}: {
  initialTasks: Task[];
}) {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // HANDLE DELETE ZONE DROP
    if (destination.droppableId === "DELETE_ZONE") {
      // 1. Optimistic UI: Filter out the task
      setTasks(tasks.filter((t) => t.id !== draggableId));
      // 2. Database: Soft Delete
      await softDeleteTaskAction(draggableId);
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // 1. Optimistic UI Update
    const newTasks = Array.from(tasks);
    const draggedTask = newTasks.find((t) => t.id === draggableId);
    if (draggedTask) {
      draggedTask.status = destination.droppableId;
      setTasks(newTasks);
    }

    // 2. Persist to Backend
    await updateTaskStatusAction(draggableId, destination.droppableId);
  };

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 h-full min-w-max">
          {COLUMNS.map((column) => (
            <div key={column.id} className="w-80 flex flex-col h-full">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      column.color,
                    )}
                  >
                    {column.title}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {tasks.filter((t) => t.status === column.id).length}
                  </span>
                </div>
                <MoreHorizontal
                  size={18}
                  className="text-slate-400 cursor-pointer hover:text-slate-600"
                />
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 rounded-2xl p-2 transition-colors duration-200",
                      snapshot.isDraggingOver
                        ? "bg-indigo-50/50"
                        : "bg-transparent",
                    )}
                  >
                    {tasks
                      .filter((task) => task.status === column.status)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "mb-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm transition-all",
                                snapshot.isDragging
                                  ? "shadow-2xl ring-2 ring-indigo-600/20 rotate-2"
                                  : "hover:border-indigo-200",
                              )}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="text-sm font-bold text-slate-800 leading-tight">
                                  {task.task || "Untitled Task"}
                                </h4>
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical size={16} />
                                </div>
                              </div>

                              {task.details && (
                                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                                  {task.details}
                                </p>
                              )}

                              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                  <Calendar size={12} />
                                  <span>Today</span>
                                </div>
                                <div
                                  className={cn(
                                    "h-2 w-2 rounded-full",
                                    task.priority > 3
                                      ? "bg-rose-500 animate-pulse"
                                      : "bg-amber-400",
                                  )}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
        {/* DELETE ZONE */}
        <Droppable droppableId="DELETE_ZONE">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md transition-all duration-300 transform",
                snapshot.isDraggingOver
                  ? "scale-110 opacity-100"
                  : "scale-100 opacity-60",
              )}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed transition-all",
                  snapshot.isDraggingOver
                    ? "bg-rose-600 border-rose-400 text-white shadow-2xl shadow-rose-200"
                    : "bg-white border-slate-200 text-slate-400",
                )}
              >
                <Trash2
                  size={snapshot.isDraggingOver ? 32 : 24}
                  className={cn(
                    "transition-all mb-2",
                    snapshot.isDraggingOver && "animate-bounce",
                  )}
                />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  {snapshot.isDraggingOver
                    ? "Release to Delete"
                    : "Drag here to remove"}
                </span>

                {/* Required hidden placeholder for DND */}
                <div className="hidden">{provided.placeholder}</div>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
