import {
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  format,
  parseISO,
} from "date-fns";

export function formDataToObject(fd: FormData) {
  const obj: Record<string, unknown> = {};
  fd.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

function getParam(value: string | string[] | undefined): string | null {
  if (!value) return null;
  return Array.isArray(value) ? value.join(",") : value;
}

export function extractFilters<T extends Record<string, string>>(
  searchParams: Record<string, string | string[] | undefined>,
  map: T,
): Partial<Record<T[keyof T], string>> {
  const filters: Partial<Record<T[keyof T], string>> = {};

  for (const key in map) {
    const filterKey = map[key];
    const value = getParam(searchParams[key]);

    if (value) {
      filters[filterKey] = value;
    }
  }

  return filters;
}

export function normalizeBoolean(val?: unknown) {
  return String(val).trim() === "true" ? true : false;
}

export function normalizeNumber(val?: unknown, fallback: number = 0) {
  if (isNaN(+String(val))) {
    return fallback;
  } else {
    return +String(val);
  }
}

export function normalizeDate(value: unknown): Date | null {
  if (!value) return null;

  // Handle string "null", "undefined", empty
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (!v || v === "null" || v === "undefined" || v === "nan") {
      return null;
    }
  }

  // Already a valid Date
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // Excel serial number (days since 1899-12-30)
  if (typeof value === "number") {
    if (value <= 0) return null;

    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + value * 86400000);

    return isNaN(date.getTime()) ? null : date;
  }

  // Parse strings
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();

    if (
      trimmed === "" ||
      trimmed === "null" ||
      trimmed === "n/a" ||
      trimmed === "-"
    ) {
      return null;
    }

    // Try native parsing first (ISO, RFC, etc.)
    const native = new Date(value);
    if (!isNaN(native.getTime())) {
      return native;
    }

    // dd.mm.yyyy or dd/mm/yyyy
    const dmyMatch = value.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);

    if (dmyMatch) {
      const [, d, m, y] = dmyMatch.map(Number);
      const date = new Date(y, m - 1, d);
      return isNaN(date.getTime()) ? null : date;
    }
  }

  return null;
}

function mergeDateAndTime(date?: string, time?: string) {
  if (!date) return null;
  const d = new Date(date);
  if (time) {
    const [h, m] = time.split(":").map(Number);
    d.setHours(h, m, 0, 0);
  }
  return d;
}

type DueInfo = {
  message: string;
  isOverdue: boolean;
  isToday: boolean;
};

export function getDueInfo(dueOn?: string, dueAt?: string): DueInfo | null {
  if (!dueOn) return null;

  // Build a Date safely
  const date = parseISO(`${dueOn}T${dueAt ?? "23:59"}`);

  const now = new Date();

  const overdue = isPast(date) && !isToday(date);

  let message: string;

  if (isToday(date)) {
    message = dueAt ? `Today · ${format(date, "HH:mm")}` : "Today";
  } else if (isTomorrow(date)) {
    message = "Tomorrow";
  } else if (isYesterday(date)) {
    message = "Yesterday";
  } else {
    message = format(date, dueAt ? "MMM d · HH:mm" : "MMM d");
  }

  return {
    message,
    isOverdue: overdue,
    isToday: isToday(date),
  };
}
