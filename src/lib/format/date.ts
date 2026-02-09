export function formatDateToParam(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
}

export function parseParamToDate(param?: string | null) {
  if (!param) return new Date();

  const [dd, mm, yy] = param.split("-");
  if (!dd || !mm || !yy) return new Date();

  return new Date(`20${yy}-${mm}-${dd}`);
}

export function parseDayParam(day?: string | null) {
  if (!day) return new Date();

  const [dd, mm, yy] = day.split("-");
  if (!dd || !mm || !yy) return new Date();

  const date = new Date(Number(`20${yy}`), Number(mm) - 1, Number(dd));
  return isNaN(date.getTime()) ? new Date() : date;
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function toInputDateValue(date: Date) {
  return date.toISOString().split("T")[0]; // yyyy-mm-dd
}

// lib/journal-date.ts
export function getDayRange(dayParam?: string | null) {
  let date: Date;

  if (dayParam) {
    const [dd, mm, yy] = dayParam.split("-");

    if (dd && mm && yy) {
      const year = Number(`20${yy}`);
      const month = Number(mm) - 1;
      const day = Number(dd);

      const parsed = new Date(year, month, day);
      if (!isNaN(parsed.getTime())) {
        date = parsed;
      } else {
        date = new Date();
      }
    } else {
      date = new Date();
    }
  } else {
    date = new Date();
  }

  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );

  const end = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
    0,
    0,
    0,
    0,
  );

  return { start, end };
}
