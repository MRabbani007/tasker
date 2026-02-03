import Pagination from "@/components/Pagination";
import UserFormTrigger from "@/components/UserFormTrigger";
import CardTaskList from "@/features/tasks/CardTaskList";
import FormTaskList from "@/features/tasks/FormTaskList";
import { getTaskListsWithSummary } from "@/lib/actions/user/tasklists";
import { extractFilters } from "@/lib/helpers";
import { Plus } from "lucide-react";

const FILTER_MAP = {
  query: "query",
} as const;

const itemsPerPage = 10;

export default async function ListsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = +(resolvedSearchParams?.page ?? 1);

  const filters: TaskListFilters = extractFilters(
    resolvedSearchParams,
    FILTER_MAP,
  );

  const { data, count = 0 } = await getTaskListsWithSummary({
    page,
    itemsPerPage,
    filters,
  });

  return (
    <main className="flex-1 flex flex-col p-4 md:p-6 gap-4">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              My Lists
            </h1>
            <p className="mt-1 text-zinc-600">
              Organize your tasks into focused, manageable lists.
            </p>
          </div>
          <UserFormTrigger type="container" value="CREATE_LIST">
            <button className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition">
              <Plus size={16} />
              Create List
            </button>
          </UserFormTrigger>
        </div>
      </div>
      <div className="flex-1">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((item) => (
            <CardTaskList key={item.id} taskList={item} />
          ))}
        </div>
      </div>
      <Pagination
        page={page}
        count={count}
        className={"mx-auto"}
        itemsPerPage={itemsPerPage}
      />
      <FormTaskList />
    </main>
  );
}
