import { JournalEntry } from "@/lib/types";
import React from "react";

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

const history = [
  { date: "Yesterday", mood: "🔥", win: "Finished the API integration" },
  { date: "Feb 2", mood: "😊", win: "Consistent 2-hour deep work" },
  { date: "Feb 1", mood: "😐", win: "Read 20 pages of my book" },
];

export default function page() {
  return <div>page</div>;
}
