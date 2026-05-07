"use client";

import { useEffect } from "react";
import { useTasks } from "./TaskProvider";
import { getTaskListSummaries } from "@/lib/actions/user/tasklists";

export default function TaskHydratorClient({
  taskLists,
}: {
  taskLists?: TaskListDTO[];
}) {
  const { setTaskLists, setTaskListSummaries } = useTasks();

  useEffect(() => {
    if (taskLists !== undefined) setTaskLists(taskLists);
  }, [taskLists]);

  useEffect(() => {
    const loadSummaries = async () => {
      if (!taskLists || taskLists.length === 0) return;

      const ids = taskLists?.map((item) => item.id) ?? [];

      const { data } = await getTaskListSummaries(ids);

      if (data) {
        setTaskListSummaries(data);
      }
    };

    loadSummaries();
  }, [taskLists]);

  return null;
}
