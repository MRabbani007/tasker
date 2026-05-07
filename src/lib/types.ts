declare global {
  interface JournalEntry {
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

  type JournalItemType = "task" | "note" | "highlight" | "routine";

  interface JournalItem {
    id: string;
    type: JournalItemType;
    content: string;
    time?: string; // "14:30"
    meta?: {
      list?: string;
      priority?: "low" | "medium" | "high";
    };
  }

  interface DaySnapshot {
    date: string; // ISO
    completedCount: number;
    energy: number; // 1–5
    highlight?: string;
  }

  type TaskListSummary = {
    taskListId: string;
    important: number;
    dueToday: number;
    dueThisWeek: number;
    overdue: number;
    open: number;
    completed: number;
  };

  type TaskListDTO = {
    id: string;
    title: string | null;
    subtitle: string | null;
    details: string | null;
    icon: string | null;
    color: string | null;
    summary?: TaskListSummary | null;
    pinnedAt?: Date | null;
    deletedAt?: Date | null;
  };
}

export {};
