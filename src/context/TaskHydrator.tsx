import { getTaskLists } from "@/lib/actions/user/tasklists";
import React from "react";
import TaskHydratorClient from "./TaskHydratorClient";

export default async function TaskHydrator() {
  const { data: userLists = [] } = await getTaskLists({
    page: 1,
    itemsPerPage: 10,
  });

  return <TaskHydratorClient taskLists={userLists} />;
}
