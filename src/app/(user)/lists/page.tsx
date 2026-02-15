import Pagination from "@/components/Pagination";
import UserFormTrigger from "@/components/UserFormTrigger";
import TaskListCard from "@/features/tasks/CardTaskList";
import FormTaskList from "@/features/tasks/FormTaskList";
import { getTaskListsWithSummary } from "@/lib/actions/user/tasklists";
import { extractFilters } from "@/lib/helpers";
import { Plus, Search, Pin, Layers, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";

const itemsPerPage = 10;

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Group your tasks into collections to keep your work structured and easy to navigate.",
  openGraph: {
    title: "Collections · Tasker",
    description:
      "Organize tasks into collections for better clarity and workflow.",
  },
};

export default async function ListsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = +(resolvedSearchParams?.page ?? 1);
  const filters: TaskListFilters = extractFilters(resolvedSearchParams, {
    query: "query",
  });

  const { data, count = 0 } = await getTaskListsWithSummary({
    page,
    itemsPerPage: 12,
    filters,
  });

  const pinnedLists = data.filter((list) => !!list.pinnedAt);
  const generalLists = data.filter((list) => !list.pinnedAt);

  return (
    <main className="flex-1 flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
      {/* 1. Page Header */}
      <header className="flex md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Task Collections
          </h1>
          <p className="text-slate-500 font-medium">
            Manage {count} active collections and monitor progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Filter collections..."
              className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all placeholder:text-slate-400"
            />
          </div>
          <UserFormTrigger type="container" value="CREATE_LIST">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
              <Plus size={18} />
              <span className="hidden md:inline">Create List</span>
            </button>
          </UserFormTrigger>
        </div>
      </header>

      {/* 2. Pinned Section (The "Spotlight") */}
      {pinnedLists.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Pin className="h-4 w-4 text-amber-600 fill-amber-600" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-amber-700">
              Favorites
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pinnedLists.map((item) => (
              <TaskListCard key={item.id} taskList={item} />
            ))}
          </div>
        </section>
      )}

      {/* 3. General Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <LayoutGrid className="h-4 w-4 text-slate-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              All Collections
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            View: Grid
          </span>
        </div>

        {generalLists.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {generalLists.map((item) => (
              <TaskListCard key={item.id} taskList={item} />
            ))}
          </div>
        ) : (
          pinnedLists.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-100 rounded-4xl bg-slate-50/50">
              <Layers className="h-12 w-12 text-slate-200 mb-4" />
              <h3 className="text-slate-900 font-bold text-lg">
                No collections found
              </h3>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                Start by grouping your tasks into a new list.
              </p>
            </div>
          )
        )}
      </section>

      {/* 4. Navigation */}
      <div className="mt-auto py-10">
        <Pagination
          page={page}
          count={count}
          className="mx-auto"
          itemsPerPage={itemsPerPage}
        />
      </div>

      <FormTaskList />
    </main>
  );
}
