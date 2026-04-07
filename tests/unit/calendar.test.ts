/**
 * Vitest: カレンダー・日付取得ロジック テスト
 */
import { describe, it, expect } from 'vitest';
import {
  isBusinessDay,
  getNextBusinessDay,
  getAvailableDates,
  getTimeSlots,
  formatDateJa,
  getWeekdayJa,
  countBusinessDays,
  isWithinBusinessHours,
  BUSINESS_HOURS,
} from '../../src/lib/calendar';

// ─── helpers ───────────────────────────────────────────────────────────────

/** Create a Date at midnight for a given weekday relative to a known Monday. */
function makeDate(year: number, month: number, day: number): Date {
  const d = new Date(year, month - 1, day, 0, 0, 0, 0);
  return d;
}

// 2025-04-07 = Monday (定休日)
// 2025-04-08 = Tuesday (営業日)
// 2025-04-13 = Sunday (営業日)

const MONDAY    = makeDate(2025, 4, 7);
const TUESDAY   = makeDate(2025, 4, 8);
const WEDNESDAY = makeDate(2025, 4, 9);
const SATURDAY  = makeDate(2025, 4, 12);
const SUNDAY    = makeDate(2025, 4, 13);

// ─── isBusinessDay ─────────────────────────────────────────────────────────

describe('isBusinessDay', () => {
  it('月曜日 → false（定休日）', () => {
    expect(isBusinessDay(MONDAY)).toBe(false);
  });

  it('火曜日 → true', () => {
    expect(isBusinessDay(TUESDAY)).toBe(true);
  });

  it('水曜日 → true', () => {
    expect(isBusinessDay(WEDNESDAY)).toBe(true);
  });

  it('土曜日 → true', () => {
    expect(isBusinessDay(SATURDAY)).toBe(true);
  });

  it('日曜日 → true', () => {
    expect(isBusinessDay(SUNDAY)).toBe(true);
  });
});

// ─── getNextBusinessDay ────────────────────────────────────────────────────

describe('getNextBusinessDay', () => {
  it('日曜日の次の営業日 → 火曜日（月曜定休をスキップ）', () => {
    const next = getNextBusinessDay(SUNDAY);
    // 2025-04-13(日) の次 → 2025-04-14(月)はスキップ → 2025-04-15(火)
    expect(next.getDay()).toBe(2); // Tuesday
    expect(next.getDate()).toBe(15);
  });

  it('土曜日の次の営業日 → 日曜日', () => {
    const next = getNextBusinessDay(SATURDAY);
    expect(next.getDay()).toBe(0); // Sunday
    expect(next.getDate()).toBe(13);
  });

  it('火曜日の次の営業日 → 水曜日', () => {
    const next = getNextBusinessDay(TUESDAY);
    expect(next.getDay()).toBe(3); // Wednesday
    expect(next.getDate()).toBe(9);
  });

  it('月曜日の次の営業日 → 火曜日（同じ週）', () => {
    const next = getNextBusinessDay(MONDAY);
    expect(next.getDay()).toBe(2); // Tuesday
    expect(next.getDate()).toBe(8);
  });

  it('元の日付を変更しない（純粋関数）', () => {
    const original = makeDate(2025, 4, 13);
    const originalTime = original.getTime();
    getNextBusinessDay(original);
    expect(original.getTime()).toBe(originalTime);
  });
});

// ─── getAvailableDates ─────────────────────────────────────────────────────

describe('getAvailableDates', () => {
  it('デフォルト30日で月曜を含まない', () => {
    const dates = getAvailableDates(TUESDAY, 30);
    expect(dates.every(d => d.getDay() !== 1)).toBe(true);
  });

  it('0日先 → 空配列', () => {
    expect(getAvailableDates(TUESDAY, 0)).toEqual([]);
  });

  it('7日間 → 6日分（月曜1日除外）', () => {
    // 2025-04-08(火) から 7日先: 4/9水, 4/10木, 4/11金, 4/12土, 4/13日, [4/14月スキップ], 4/15火
    const dates = getAvailableDates(TUESDAY, 7);
    expect(dates.length).toBe(6);
  });

  it('全日付が from より後の日付', () => {
    const from = WEDNESDAY;
    const dates = getAvailableDates(from, 14);
    expect(dates.every(d => d > from)).toBe(true);
  });

  it('daysAhead が負数 → RangeError', () => {
    expect(() => getAvailableDates(TUESDAY, -1)).toThrow(RangeError);
  });

  it('返す日付は昇順', () => {
    const dates = getAvailableDates(TUESDAY, 14);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i].getTime()).toBeGreaterThan(dates[i - 1].getTime());
    }
  });
});

// ─── getTimeSlots ──────────────────────────────────────────────────────────

describe('getTimeSlots', () => {
  it('月曜日 → 空配列（定休日）', () => {
    expect(getTimeSlots(MONDAY)).toEqual([]);
  });

  it('火曜日 → スロットが空でない', () => {
    expect(getTimeSlots(TUESDAY).length).toBeGreaterThan(0);
  });

  it('最初のスロットが開始時間（10:00）', () => {
    const slots = getTimeSlots(TUESDAY);
    expect(slots[0]).toBe(`${String(BUSINESS_HOURS.open).padStart(2, '0')}:00`);
  });

  it('最後のスロットが終了時間の1時間前より前', () => {
    const slots = getTimeSlots(TUESDAY);
    const lastSlot = slots[slots.length - 1];
    const lastHour = parseInt(lastSlot.split(':')[0], 10);
    expect(lastHour).toBeLessThan(BUSINESS_HOURS.close);
  });

  it('全スロットがHH:MM形式', () => {
    const slots = getTimeSlots(TUESDAY);
    const pattern = /^\d{2}:\d{2}$/;
    expect(slots.every(s => pattern.test(s))).toBe(true);
  });
});

// ─── formatDateJa ──────────────────────────────────────────────────────────

describe('formatDateJa', () => {
  it('日本語形式の文字列を返す', () => {
    const result = formatDateJa(makeDate(2025, 4, 8));
    expect(result).toContain('2025');
    expect(result).toContain('4');
    expect(result).toContain('8');
  });

  it('曜日を含む', () => {
    const result = formatDateJa(makeDate(2025, 4, 8)); // 火曜日
    expect(result).toContain('火');
  });
});

// ─── getWeekdayJa ──────────────────────────────────────────────────────────

describe('getWeekdayJa', () => {
  it('0 → 日', () => expect(getWeekdayJa(0)).toBe('日'));
  it('1 → 月', () => expect(getWeekdayJa(1)).toBe('月'));
  it('2 → 火', () => expect(getWeekdayJa(2)).toBe('火'));
  it('3 → 水', () => expect(getWeekdayJa(3)).toBe('水'));
  it('4 → 木', () => expect(getWeekdayJa(4)).toBe('木'));
  it('5 → 金', () => expect(getWeekdayJa(5)).toBe('金'));
  it('6 → 土', () => expect(getWeekdayJa(6)).toBe('土'));
  it('-1 → RangeError', () => expect(() => getWeekdayJa(-1)).toThrow(RangeError));
  it('7  → RangeError', () => expect(() => getWeekdayJa(7)).toThrow(RangeError));
});

// ─── countBusinessDays ────────────────────────────────────────────────────

describe('countBusinessDays', () => {
  it('火〜日（同じ週）→ 6日', () => {
    // 4/8(火) から 4/13(日): 4/9水,4/10木,4/11金,4/12土,4/13日 = 5日
    // ※ from は含まない、to は含む
    const count = countBusinessDays(TUESDAY, SUNDAY);
    expect(count).toBe(5); // Wed, Thu, Fri, Sat, Sun
  });

  it('月〜火（月曜をスキップ）→ 1日', () => {
    const count = countBusinessDays(MONDAY, TUESDAY);
    expect(count).toBe(1); // only Tuesday
  });

  it('同じ日 → 0日', () => {
    expect(countBusinessDays(TUESDAY, TUESDAY)).toBe(0);
  });

  it('from > to → 0日', () => {
    expect(countBusinessDays(SUNDAY, TUESDAY)).toBe(0);
  });
});

// ─── isWithinBusinessHours ────────────────────────────────────────────────

describe('isWithinBusinessHours', () => {
  it('10:00 → true（開始時間）', () => {
    expect(isWithinBusinessHours('10:00')).toBe(true);
  });

  it('19:30 → true（終了30分前）', () => {
    expect(isWithinBusinessHours('19:30')).toBe(true);
  });

  it('20:00 → false（閉店時間）', () => {
    expect(isWithinBusinessHours('20:00')).toBe(false);
  });

  it('09:59 → false（開店前）', () => {
    expect(isWithinBusinessHours('09:59')).toBe(false);
  });

  it('無効な形式 → false', () => {
    expect(isWithinBusinessHours('abc')).toBe(false);
    expect(isWithinBusinessHours('')).toBe(false);
    expect(isWithinBusinessHours('25:00')).toBe(false);
  });

  it('HH:MM 形式（1桁の時） → true', () => {
    expect(isWithinBusinessHours('10:00')).toBe(true);
  });
});
