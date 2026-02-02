import Pagination from "@/components/Pagination";
import UserFormTrigger from "@/components/UserFormTrigger";
import CardTask from "@/features/tasks/CardTask";
import FormTask from "@/features/tasks/FormTask";
import FormTaskList from "@/features/tasks/FormTaskList";
import TaskListsSidebar from "@/features/tasks/TaskListsSidebar";
import { getTaskListById, getTaskLists } from "@/lib/actions/user/tasklists";
import { getTasks } from "@/lib/actions/user/tasks";
import { extractFilters } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { ArrowLeft, MoreVertical, Pin } from "lucide-react";
import Link from "next/link";
import React from "react";

const FILTER_MAP = {
  query: "query",
  completed: "completed",
  priority: "priority",
  taskList: "taskList",
  dueOn: "dueOn",
  completedAt: "completedAt",
} as const;

const itemsPerPage = 20;

export default async function ListByIdPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const id = (await params).id;

  const { data: taskList } = await getTaskListById(id);
  const isPinned = !!taskList?.pinnedAt;

  const resolvedSearchParams = await searchParams;
  const page = +(resolvedSearchParams?.page ?? 1);

  const filters: TaskFilters = extractFilters(resolvedSearchParams, FILTER_MAP);

  filters.taskList = id;

  const { data, count = 0 } = await getTasks({
    page,
    itemsPerPage,
    filters,
  });

  const { data: taskLists } = await getTaskLists({ page: 1, itemsPerPage: 20 });

  return (
    <main className="flex-1 flex items-stretch">
      <TaskListsSidebar lists={taskLists} />;
      <div className="flex-1 flex flex-col pb-4">
        <header className=" bg-white/80 backdrop-blur border-b border-zinc-200">
          <div className="px-4 py-5 max-w-5xl mx-auto">
            {/* Back */}
            <Link
              href="/lists"
              className="mb-3 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition"
            >
              <ArrowLeft size={16} />
              My Lists
            </Link>

            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold text-zinc-900">
                  {taskList?.title}
                </h1>

                {taskList?.subtitle?.trim() && (
                  <p className="mt-1 text-sm text-zinc-600">
                    {taskList?.subtitle}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  title={isPinned ? "Unpin list" : "Pin list"}
                  className={cn(
                    "rounded-lg p-2 transition",
                    isPinned
                      ? "text-sky-700 bg-sky-100"
                      : "text-zinc-500 hover:bg-zinc-100",
                  )}
                >
                  <Pin size={16} />
                </button>
                {taskList && (
                  <UserFormTrigger
                    type="icon"
                    iconName="add"
                    editItem={{ type: "tasklist", data: taskList }}
                    value="CREATE_TASK"
                    className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 transition"
                  />
                )}
                <button className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 transition">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-6">
            {data.map((task) => (
              <CardTask key={task.id} task={task} />
            ))}
          </div>
        </div>
        <Pagination
          page={page}
          count={count}
          className={"mx-auto"}
          itemsPerPage={itemsPerPage}
        />
      </div>
      <FormTask />
      <FormTaskList />
    </main>
  );
}
