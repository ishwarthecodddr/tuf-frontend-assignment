export function startOfDay(date: Date): Date {
  const clone = new Date(date);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function formatISODate(date: Date): string {
  return startOfDay(date).toISOString();
}

export function parseISODate(value: string): Date {
  return new Date(value);
}

export function clampToRange(date: Date, start: Date, end: Date): boolean {
  const day = startOfDay(date).getTime();
  return day >= startOfDay(start).getTime() && day <= startOfDay(end).getTime();
}

export function getMonthMeta(baseDate: Date): {
  monthLabel: string;
  monthStart: Date;
  daysInMonth: number;
  firstWeekdayIndex: number;
} {
  const monthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const monthLabel = monthStart.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
  ).getDate();
  const firstWeekdayIndex = monthStart.getDay();

  return { monthLabel, monthStart, daysInMonth, firstWeekdayIndex };
}
