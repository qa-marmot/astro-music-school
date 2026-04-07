/**
 * カレンダー・日付取得ロジック
 * Calendar utilities for lesson scheduling
 *
 * 教室の営業日：火〜日（月曜定休）
 * Business days: Tuesday–Sunday (closed on Monday)
 */

export const CLOSED_DAYS = [1] as const; // 0=Sun, 1=Mon, ..., 6=Sat
export const BUSINESS_HOURS = { open: 10, close: 20 } as const; // 10:00–20:00

/** Returns true if the given date is a business day (not Monday) */
export function isBusinessDay(date: Date): boolean {
  return !CLOSED_DAYS.includes(date.getDay() as 1);
}

/** Returns the next available business day after the given date */
export function getNextBusinessDay(from: Date): Date {
  const next = new Date(from);
  next.setHours(0, 0, 0, 0);
  do {
    next.setDate(next.getDate() + 1);
  } while (!isBusinessDay(next));
  return next;
}

/**
 * Returns an array of available business dates within the next `daysAhead` days
 * starting from the day after `from`.
 */
export function getAvailableDates(from: Date, daysAhead: number = 30): Date[] {
  if (daysAhead < 0) throw new RangeError('daysAhead must be >= 0');

  const dates: Date[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < daysAhead; i++) {
    cursor.setDate(cursor.getDate() + 1);
    if (isBusinessDay(cursor)) {
      dates.push(new Date(cursor));
    }
  }
  return dates;
}

/**
 * Returns available time slots for a given date.
 * Slots are every 60 minutes from open to close - 1 hour.
 */
export function getTimeSlots(date: Date): string[] {
  if (!isBusinessDay(date)) return [];

  const slots: string[] = [];
  for (let h = BUSINESS_HOURS.open; h < BUSINESS_HOURS.close; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < BUSINESS_HOURS.close - 1) {
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
  }
  return slots;
}

/**
 * Format a Date object as Japanese locale string.
 * e.g. "2025年4月7日（月）"
 */
export function formatDateJa(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year:    'numeric',
    month:   'long',
    day:     'numeric',
    weekday: 'short',
  });
}

/**
 * Returns the Japanese weekday name for a given day number (0=日, 1=月, ..., 6=土).
 */
export function getWeekdayJa(dayIndex: number): string {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  if (dayIndex < 0 || dayIndex > 6) throw new RangeError('dayIndex must be 0–6');
  return days[dayIndex];
}

/**
 * Count business days between two dates (exclusive of `from`, inclusive of `to`).
 */
export function countBusinessDays(from: Date, to: Date): number {
  let count = 0;
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (cursor < end) {
    cursor.setDate(cursor.getDate() + 1);
    if (isBusinessDay(cursor)) count++;
  }
  return count;
}

/**
 * Returns true if a given time string (HH:MM) is within business hours.
 */
export function isWithinBusinessHours(timeStr: string): boolean {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return false;
  const hour = parseInt(match[1], 10);
  const min  = parseInt(match[2], 10);
  if (min < 0 || min > 59) return false;
  return hour >= BUSINESS_HOURS.open && hour < BUSINESS_HOURS.close;
}
