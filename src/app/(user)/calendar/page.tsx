import Calendar from "@/features/calendar/Calendar";
import FormTask from "@/features/tasks/FormTask";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description:
    "Plan your days and weeks by viewing tasks and activities on a calendar timeline.",
  openGraph: {
    title: "Calendar · Tasker",
    description:
      "Visualize your tasks and plans across days, weeks, and months.",
  },
};

export default function CalendarPage() {
  return (
    <main className="flex-1 flex flex-col p-4 lg:p-8">
      <Calendar />
      <FormTask />
    </main>
  );
}
