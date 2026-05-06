import Pagination from "@/components/Pagination";
import UserFormTrigger from "@/components/UserFormTrigger";
import CardTask from "@/features/tasks/CardTask";
import FormPinTaskList from "@/features/tasks/FormPinTaskList";
import FormTask from "@/features/tasks/FormTask";
import FormTaskList from "@/features/tasks/FormTaskList";
import TaskListsSidebar from "@/features/tasks/TaskListsSidebar";
import { getTaskListById, getTaskLists } from "@/lib/actions/user/tasklists";
import { getTasks } from "@/lib/actions/user/tasks";
import { extractFilters } from "@/lib/helpers";
import { ArrowLeft, MoreVertical, Plus } from "lucide-react";
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
    <main className="flex-1 flex items-stretch relative">
      <TaskListsSidebar lists={taskLists} />
      <div className="flex-1 flex flex-col pb-4">
        <header className="bg-white/80 backdrop-blur border-b border-zinc-200 w-full px-8">
          <div className="px-4 py-5 w-full">
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
                {/* Form trigger now wraps the Title and Subtitle */}
                {taskList ? (
                  <UserFormTrigger
                    editItem={{ type: "tasklist", data: taskList }}
                    value="EDIT_LIST"
                    className="group text-left block"
                  >
                    <h1 className="truncate text-2xl font-semibold text-zinc-900 group-hover:text-indigo-600 transition">
                      {taskList?.title}
                    </h1>
                    {taskList?.subtitle?.trim() && (
                      <p className="mt-1 text-sm text-zinc-600 group-hover:text-zinc-900">
                        {taskList?.subtitle}
                      </p>
                    )}
                  </UserFormTrigger>
                ) : (
                  <h1 className="truncate text-2xl font-semibold text-zinc-900">
                    Loading...
                  </h1>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <FormPinTaskList
                  id={taskList?.id ?? ""}
                  isPinned={!!taskList?.pinnedAt}
                />

                {taskList && (
                  <UserFormTrigger
                    type="container"
                    editItem={{ type: "tasklist", data: taskList }}
                    value="CREATE_TASK"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                  >
                    <Plus size={18} />
                    <span>Add Task</span>
                  </UserFormTrigger>
                )}

                {taskList && (
                  <UserFormTrigger
                    type="icon"
                    icon={<MoreVertical size={18} />}
                    editItem={{ type: "tasklist", data: taskList }}
                    value="EDIT_LIST"
                    className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 transition"
                  />
                )}
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
