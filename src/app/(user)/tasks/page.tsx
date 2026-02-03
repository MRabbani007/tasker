import Pagination from "@/components/Pagination";
import UserFormTrigger from "@/components/UserFormTrigger";
import CardTask from "@/features/tasks/CardTask";
import FormTask from "@/features/tasks/FormTask";
import FormTaskList from "@/features/tasks/FormTaskList";
import { getTasks } from "@/lib/actions/user/tasks";
import { extractFilters } from "@/lib/helpers";
import { Plus } from "lucide-react";
import TaskFilters from "@/features/tasks/TaskFilters";
import CardTaskOld from "@/features/tasks/CardTaskOld";

const FILTER_MAP = {
  query: "query",
  completed: "completed",
  priority: "priority",
  taskList: "taskList",
  dueOn: "dueOn",
  completedAt: "completedAt",
} as const;

const itemsPerPage = 20;

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

  return (
    <main className="flex-1 flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
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
            <span>Add Task</span>
          </button>
        </UserFormTrigger>
      </header>

      {/* Filter Bar */}
      <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-2xl">
        <TaskFilters />
        <div className="flex items-center gap-2 pr-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Sort: Default
          </span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((task) => (
            <CardTask key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Repeated */}
      {/* <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
          {data.map((task) => (
            <CardTaskOld key={task.id} task={task} />
          ))}
        </div>
      </div> */}

      <div className="py-10 border-t border-slate-100">
        <Pagination page={page} count={count} itemsPerPage={itemsPerPage} />
      </div>

      <FormTask />
      <FormTaskList />
    </main>
  );
}
