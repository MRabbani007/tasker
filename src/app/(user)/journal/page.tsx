import UserFormTrigger from "@/components/UserFormTrigger";
import DateSelector from "@/features/journal/DateSelector";
import FormJournalEntry from "@/features/journal/FormJournalEntry";
import { JournalDayNavigator } from "@/features/journal/JournalDayNavigator";
import { getJournalEntries } from "@/lib/actions/user/journal";
import { extractFilters } from "@/lib/helpers";
import { acrylic } from "@/lib/shared";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Reflect on your day, track habits, and keep a personal journal in Tasker.",
  openGraph: {
    title: "Journal · Tasker",
    description:
      "A private space for daily reflections, journaling, and self-tracking.",
  },
};

const typeIcon = {
  task: "✔",
  note: "📝",
  highlight: "⭐",
  routine: "🔁",
};

// const snapshot: DaySnapshot = {
//   date: new Date().toISOString(),
//   completedCount: 7,
//   energy: 4,
//   highlight: "Fixed Calendar UI",
// };

const FILTER_MAP = {
  query: "query",
  day: "day",
  completed: "completed",
  priority: "priority",
  taskList: "taskList",
  dueOn: "dueOn",
  completedAt: "completedAt",
} as const;

const itemsPerPage = 20;

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = +(resolvedSearchParams?.page ?? 1);

  const filters: JournalFilters = extractFilters(
    resolvedSearchParams,
    FILTER_MAP,
  );

  const { data } = await getJournalEntries({
    page,
    itemsPerPage,
    filters,
  });

  return (
    <main className="flex-1 flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <header
        className={cn(
          "flex flex-col md:flex-row md:items-end justify-between gap-4 rounded-2xl p-4",
          acrylic,
        )}
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 duration-200">
            Daily Journal
          </h1>
          {/* Date  */}
          <DateSelector />
        </div>

        <UserFormTrigger type="container" value="CREATE_JOURNAL_ENTRY">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
            <Plus size={18} />
            <span>Add Entry</span>
          </button>
        </UserFormTrigger>
      </header>
      <JournalDayNavigator />
      <section className="relative pl-6 space-y-4">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-indigo-300/40" />
        {data.map((item) => (
          <UserFormTrigger
            type="container"
            value="EDIT_JOURNAL_ENTRY"
            editItem={{ type: "journal", data: item }}
            key={item.id}
            className="relative flex gap-4"
          >
            <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">
              {typeIcon[item.type as keyof typeof typeIcon]}
            </div>
            <div
              className={`${acrylic} rounded-xl px-4 py-3 flex-1 hover:bg-white/80 transition`}
            >
              {item.occurredOn && (
                <p className="text-xs text-indigo-700/60">
                  {item.occurredOn.toISOString().split("T")[0]}
                </p>
              )}

              <p className="text-sm text-indigo-950">{item.content}</p>

              {/* {item.meta?.list && (
                <p className="text-xs text-indigo-700/60 mt-1">
                  {item.meta.list}
                </p>
              )} */}
            </div>
          </UserFormTrigger>
        ))}
      </section>
      <FormJournalEntry />
    </main>
  );
}
