// types/journal.ts

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

export type JournalItemType = "task" | "note" | "highlight" | "routine";

export interface JournalItem {
  id: string;
  type: JournalItemType;
  content: string;
  time?: string; // "14:30"
  meta?: {
    list?: string;
    priority?: "low" | "medium" | "high";
  };
}

export interface DaySnapshot {
  date: string; // ISO
  completedCount: number;
  energy: number; // 1–5
  highlight?: string;
}
