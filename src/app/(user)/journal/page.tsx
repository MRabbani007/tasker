import DailyReflectionForm from "@/features/journal/DailyReflectionForm";
import { JournalForm } from "@/features/journal/JournalForm";
import React from "react";

export interface JournalEntry {
  id?: string;
  date: string;
  mood: "great" | "good" | "okay" | "bad" | "awful" | string;
  energyLevel?: number; // 1-10
  bigThreeWins?: string[];
  gratitude?: string[];
  dailyLearning?: string;
  freeWriting?: string;
  win: string;
}

const JournalEntryCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => (
  <div className="p-4 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-900 rounded-r-lg mb-4">
    <div className="flex justify-between items-start mb-2">
      <span className="font-bold text-gray-900 dark:text-white">
        {entry.date}
      </span>
      <span className="text-xl">{entry.mood === "great" ? "🤩" : "😐"}</span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
      {entry.win || "No additional notes..."}
    </p>
  </div>
);

{
  /* <div
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <span className="text-2xl">{item.mood}</span>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400">
                    {item.date}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                    {item.win}
                  </p>
                </div>
              </div> */
}

const history = [
  { date: "Yesterday", mood: "🔥", win: "Finished the API integration" },
  { date: "Feb 2", mood: "😊", win: "Consistent 2-hour deep work" },
  { date: "Feb 1", mood: "😐", win: "Read 20 pages of my book" },
];

export default async function JournalPage() {
  // You would fetch your data here using Prisma
  // const entries = await prisma.journalEntry.findMany({ orderBy: { date: 'desc' } });

  return (
    <main className="container mx-auto p-6 max-w-6xl">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Journal
        </h1>
        <p className="text-gray-500 mt-2">
          Reflect on your progress and capture daily wins.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          <JournalForm />
        </div>

        {/* Right Column: Recent Activity Feed */}
        <aside className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Past Reflections
          </h2>
          <div className="space-y-4">
            {history.map((item, idx) => (
              <JournalEntryCard key={idx} entry={item} />
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
