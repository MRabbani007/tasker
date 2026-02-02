import {
  format,
  isToday,
  isTomorrow,
  isPast,
  differenceInDays,
} from "date-fns";

export function getDueDateStatement(dueDate?: Date | null) {
  let message = "";
  let displayDate = "";
  let status = "";
  let isOverdue = false;
  let daysDifference = 0;

  if (!dueDate || isNaN(dueDate?.getSeconds())) {
    return { status, message, displayDate, isOverdue, daysDifference };
  }

  isOverdue = isPast(dueDate) && !isToday(dueDate);
  daysDifference = differenceInDays(dueDate, new Date());

  if (isToday(dueDate)) {
    message = `Due Today`;
    displayDate = format(dueDate, "PPP");
  } else if (isTomorrow(dueDate)) {
    message = `Due Tomorrow`;
    displayDate = format(dueDate, "PPP");
  } else if (daysDifference > 0 && daysDifference <= 7) {
    message = `Due in ${daysDifference} days`;
    displayDate = format(dueDate, "PPP");
  } else if (daysDifference > 7) {
    message = `Due on ${format(dueDate, "PPP")}`;
    displayDate = format(dueDate, "PPP");
  } else if (Math.abs(daysDifference) < 14) {
    message = `Overdue by ${Math.abs(daysDifference) + 1} days`;
    displayDate = format(dueDate, "PPP");
  } else {
    message = `Long Overdue (${Math.abs(daysDifference)} days)`;
    displayDate = format(dueDate, "PPP");
  }

  return { status, message, displayDate, isOverdue, daysDifference };
}
