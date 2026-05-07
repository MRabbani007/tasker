"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type TaskContextType = {
  taskLists: TaskListDTO[];
  setTaskLists: Dispatch<SetStateAction<TaskListDTO[]>>;
  setTaskListSummaries: Dispatch<SetStateAction<TaskListSummary[]>>;
  getListSummary: (listId: string) => TaskListSummary | null;
};

type fetchState = {
  isLoading: boolean;
  isError: boolean;
  success: boolean;
};

export const TaskContext = createContext<TaskContextType | null>(null);

export default function TaskProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [taskLists, setTaskLists] = useState<TaskListDTO[]>([]);

  const [taskListSummaries, setTaskListSummaries] = useState<TaskListSummary[]>(
    [],
  );

  function getListSummary(listId?: string) {
    if (!listId || !listId?.trim()) {
      return null;
    }

    return taskListSummaries.find((item) => item.taskListId === listId) ?? null;
  }

  return (
    <TaskContext.Provider
      value={{ taskLists, setTaskLists, getListSummary, setTaskListSummaries }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
