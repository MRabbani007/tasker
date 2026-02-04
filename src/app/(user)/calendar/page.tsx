import Calendar from "@/features/calendar/Calendar";
import FormTask from "@/features/tasks/FormTask";
import React from "react";

export default function CalendarPage() {
  return (
    <main className="flex-1 flex flex-col p-4 lg:p-8">
      <Calendar />
      <FormTask />
    </main>
  );
}
