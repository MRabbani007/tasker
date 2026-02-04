import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

export function getMonthDays(date: Date) {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
}

export function groupTasksByDay(tasks: any[]) {
  return tasks.reduce<Record<string, any[]>>((acc, task) => {
    const key = task?.dueAt?.toISOString()?.split("T")[0];
    acc[key] ||= [];
    acc[key].push(task);
    return acc;
  }, {});
}

export function isWeekend(date: Date) {
  const d = date.getDay();
  return d === 0 || d === 6;
}
