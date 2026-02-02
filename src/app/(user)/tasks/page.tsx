import Pagination from "@/components/Pagination";
import UserFormTrigger from "@/components/UserFormTrigger";
import CardTask from "@/features/tasks/CardTask";
import FormTask from "@/features/tasks/FormTask";
import FormTaskList from "@/features/tasks/FormTaskList";
import { getTasks } from "@/lib/actions/user/tasks";
import { extractFilters } from "@/lib/helpers";
import { Plus } from "lucide-react";
import TaskFilters from "@/features/tasks/TaskFilters";

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
    <main className="flex-1 flex flex-col p-4 md:p-6">
      {/* Page header */}
      <div className="flex flex-col gap-4">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              My Tasks
            </h1>
            <p className="text-sm text-gray-400">
              Everything you need to stay on track.
            </p>
          </div>
          <UserFormTrigger type="container" value="CREATE_TASK">
            <button className="inline-flex items-center gap-2 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90">
              <Plus size={16} />
              Add task
            </button>
          </UserFormTrigger>
        </div>
        <div className="flex items-center gap-4">
          {/* Task count */}
          <p className="text-sm text-gray-400">
            {count} {count === 1 ? "task" : "tasks"}
          </p>
          <TaskFilters />
        </div>
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
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
      <FormTask />
      <FormTaskList />
    </main>
  );
}
