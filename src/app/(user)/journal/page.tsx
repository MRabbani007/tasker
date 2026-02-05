"use client";

import { DailySnapshotCard } from "@/features/journal/DailySnapshotCard";
import { ReflectionPanel } from "@/features/journal/ReflextionPanel";
import { acrylic } from "@/lib/shared";
import { DaySnapshot, JournalItem } from "@/lib/types";

const mockItems: JournalItem[] = [
  {
    id: "1",
    type: "task",
    content: "Finish Calendar Header",
    time: "14:30",
    meta: { list: "Work", priority: "high" },
  },
  {
    id: "2",
    type: "note",
    content: "Felt more focused after lunch",
  },
  {
    id: "3",
    type: "highlight",
    content: "Calendar UI finally feels clean",
  },
];

const typeIcon = {
  task: "✔",
  note: "📝",
  highlight: "⭐",
  routine: "🔁",
};

const snapshot: DaySnapshot = {
  date: new Date().toISOString(),
  completedCount: 7,
  energy: 4,
  highlight: "Fixed Calendar UI",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      <header
        className={`${acrylic} sticky top-0 z-20 rounded-2xl px-4 py-3 flex items-center justify-between`}
      >
        <div>
          <h1 className="text-lg font-semibold text-indigo-950">
            Daily Journal
          </h1>
          <p className="text-sm text-indigo-700/70">
            {new Date().toDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xl">😌</span>
          <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition">
            + Note
          </button>
        </div>
      </header>
      <DailySnapshotCard snapshot={snapshot} />
      <section className="relative pl-6 space-y-4">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-indigo-300/40" />
        {mockItems.map((item) => (
          <div key={item.id} className="relative flex gap-4">
            <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">
              {typeIcon[item.type as keyof typeof typeIcon]}
            </div>

            <div
              className={`${acrylic} rounded-xl px-4 py-3 flex-1 hover:bg-white/80 transition`}
            >
              {item.time && (
                <p className="text-xs text-indigo-700/60">{item.time}</p>
              )}

              <p className="text-sm text-indigo-950">{item.content}</p>

              {item.meta?.list && (
                <p className="text-xs text-indigo-700/60 mt-1">
                  {item.meta.list}
                </p>
              )}
            </div>
          </div>
        ))}
      </section>
      <ReflectionPanel />
    </div>
  );
}
