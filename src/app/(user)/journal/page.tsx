import FormJournalEntry from "@/features/journal/FormJournalEntry";
import {
  getJournalEntries,
  getJournalSubjects,
} from "@/lib/actions/user/journal";
import { extractFilters, normalizeDate } from "@/lib/helpers";
import type { Metadata } from "next";
import {
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  format,
} from "date-fns";

import { JournalEntry } from "../../../../generated/prisma/client";
import JournalEntriesGroup from "@/features/journal/JournalEntriesGroup";
import { JournalHeader } from "@/features/journal/JournalHeader";

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

function getJournalGroupLabel(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  if (isThisWeek(date)) return "Earlier this week";

  if (isThisMonth(date)) return "Earlier this month";

  // After that, group by month
  return format(date, "MMMM yyyy");
}

function groupJournalEntries(entries: JournalEntry[]) {
  const groups = new Map<string, JournalEntry[]>();

  for (const entry of entries) {
    const date = normalizeDate(entry.occurredOn ?? entry.createdAt);
    if (!date) continue;

    const label = getJournalGroupLabel(date);

    if (!groups.has(label)) {
      groups.set(label, []);
    }

    groups.get(label)!.push(entry);
  }

  return Array.from(groups.entries()).map(([title, entries]) => ({
    title,
    entries: entries.sort(
      (a, b) =>
        +new Date(b.occurredOn ?? b.createdAt ?? 0) -
        +new Date(a.occurredOn ?? a.createdAt ?? 0),
    ),
  }));
}

const FILTER_MAP = {
  q: "query",
  type: "type",
  subject: "subject",
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

  const { data: subjects } = await getJournalSubjects();

  return (
    <main className="flex-1 flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full">
      <JournalHeader subjects={subjects} />
      <section className="relative pl-6 space-y-4">
        {/* <div className="absolute left-2 top-0 bottom-0 w-px bg-indigo-300/40" /> */}
        {groupJournalEntries(data).map((group) => (
          <JournalEntriesGroup
            key={group.title}
            title={group.title}
            entries={group.entries}
          />
        ))}
      </section>
      <FormJournalEntry />
    </main>
  );
}
