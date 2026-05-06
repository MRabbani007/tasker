import Pagination from "@/components/Pagination";
import UserFormTrigger from "@/components/UserFormTrigger";
import CardTask from "@/features/tasks/CardTask";
import FormTask from "@/features/tasks/FormTask";
import { getTasks } from "@/lib/actions/user/tasks";
import { extractFilters } from "@/lib/helpers";
import { Plus } from "lucide-react";
import TaskFilters from "@/features/tasks/TaskFilters";
import FormMoveTask from "@/features/tasks/FormMoveTask";
import type { Metadata } from "next";
import { TaskListSelector } from "@/features/tasks/TaskListSelector";
import SelectedTaskList from "@/features/tasks/SelectedTaskList";
import { getUserProfile } from "@/lib/actions/user/profile";
import ProfileHydrator from "@/features/profile/ProfileHydrator";
import TaskHydrator from "@/context/TaskHydrator";

const FILTER_MAP = {
  query: "query",
  due: "due",
  completed: "completed",
  priority: "priority",
  taskList: "taskList",
  dueOn: "dueOn",
  completedAt: "completedAt",
} as const;

const itemsPerPage = 20;

export const metadata: Metadata = {
  title: "Tasks",
  description:
    "Manage your tasks, set priorities, track progress, and stay focused on what matters.",
  openGraph: {
    title: "Tasks · Tasker",
    description:
      "Organize your tasks, track progress, and stay productive with Tasker.",
  },
};

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = +(resolvedSearchParams?.page ?? 1);

  const filters: TaskFilters = extractFilters(resolvedSearchParams, FILTER_MAP);

  const { data, count = 0 } = await getTasks({
    page,
    itemsPerPage,
    filters,
  });

  const { data: profile } = await getUserProfile();

  return (
    <main className="flex-1 flex items-stretch relative">
      <ProfileHydrator profile={profile} />
      <TaskHydrator />
      <div className="flex-1 flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Header Area */}
        <header className="flex md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 duration-200">
              Task Board
            </h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <span className="flex h-5 px-1.5 items-center justify-center rounded bg-slate-100 text-[11px] font-bold">
                {count}
              </span>
              <p className="text-sm">Active objectives for this period</p>
            </div>
          </div>

          <UserFormTrigger type="container" value="CREATE_TASK">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
              <Plus size={18} />
              <span className="hidden md:inline">Add Task</span>
            </button>
          </UserFormTrigger>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center p-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-500 rounded-2xl">
          <TaskFilters />
          <div className="flex items-center gap-2 pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Sort: Default
            </span>
          </div>
        </div>

        <SelectedTaskList selectedListId={filters?.taskList} />

        {/* Grid Content */}
        <div className="flex-1">
          <div
            className={"grid grid-cols-1 md:grid-cols-2  gap-6 lg:grid-cols-3"}
          >
            {data.map((task) => (
              <CardTask key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="py-10 border-t border-slate-100">
          <Pagination page={page} count={count} itemsPerPage={itemsPerPage} />
        </div>
      </div>

      <FormTask />
      <FormMoveTask />
      <TaskListSelector />
    </main>
  );
}
