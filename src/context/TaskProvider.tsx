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
};

export const TaskContext = createContext<TaskContextType | null>(null);

export default function TaskProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [taskLists, setTaskLists] = useState<TaskListDTO[]>([]);

  return (
    <TaskContext.Provider value={{ taskLists, setTaskLists }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
