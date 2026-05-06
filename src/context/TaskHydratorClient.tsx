"use client";

import { useEffect } from "react";
import { useTasks } from "./TaskProvider";

export default function TaskHydratorClient({
  taskLists,
}: {
  taskLists?: TaskListDTO[];
}) {
  const { setTaskLists } = useTasks();

  useEffect(() => {
    if (taskLists !== undefined) setTaskLists(taskLists);
  }, [taskLists]);
  return null;
}
