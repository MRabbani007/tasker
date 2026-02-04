"use client";

import { useEffect, useState } from "react";
import { MonthView } from "./MonthView";
import { Task } from "../../../generated/prisma/client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CalendarHeader } from "./CalendarHeader";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { getTasks } from "@/lib/actions/user/tasks";

export type CalendarView = "month" | "week" | "day";
const calendarViewOptions = ["month", "week", "day"] as const;

export interface CalendarFilters {
  showCompleted: boolean;
}

export interface CalendarTask {
  id: string;
  title: string;
  completed: boolean;
  priority: number;
  dueAt: Date;
  fromAt?: Date;
  toAt?: Date;
}

export default function Calendar() {
  const params = useSearchParams();
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [view, setView] = useState<CalendarView>("month");
  const [completed, setCompleted] = useState<boolean>();
  const [filters, setFilters] = useState<CalendarFilters>({
    showCompleted: false,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadView = () => {
      const temp = params.get("view")?.toLowerCase() ?? "month";
      const index = calendarViewOptions.findIndex((item) => item === temp);
      setView(index >= 0 ? calendarViewOptions[index] : "month");
    };

    const loadCompleted = () => {
      setCompleted(String(params.get("completed")) === "true" ? true : false);
    };

    const loadDate = () => {
      setCurrentDate(
        params.get("date") ? new Date(params.get("date")!) : new Date(),
      );
    };

    loadView();
    loadCompleted();
    loadDate();
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const range =
        view === "month"
          ? { type: "month", date: currentDate }
          : view === "week"
            ? { type: "week", date: currentDate }
            : { type: "day", date: currentDate };

      const { data } = await getTasks({
        //   range,
        //   showCompleted: filters.showCompleted,
      });

      setTasks(data);
      setLoading(false);
    }

    load();
  }, [view, currentDate, filters]);

  return (
    <div className="flex-1 flex flex-col gap-4 min-w-0">
      <CalendarHeader
        view={view}
        setView={setView}
        date={currentDate}
        setDate={setCurrentDate}
        filters={filters}
        setFilters={setFilters}
      />

      {view === "month" && (
        <MonthView
          date={currentDate}
          tasks={tasks}
          onDayClick={(d) => {
            setCurrentDate(d);
            setView("week");
          }}
        />
      )}

      {view === "week" && (
        <WeekView
          date={currentDate}
          tasks={tasks}
          onDayClick={(d) => {
            setCurrentDate(d);
            setView("day");
          }}
        />
      )}

      {view === "day" && <DayView date={currentDate} tasks={tasks} />}
    </div>
  );
}
