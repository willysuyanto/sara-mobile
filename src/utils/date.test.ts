import { formatDay, formatLongDate, formatMonth } from './date';

const DAY = 8;
const MONTH = 9;
const YEAR = 2026;
const DATE = new Date(YEAR, MONTH, DAY);

describe('date formatting', () => {
  it('formats the agenda date in upper case', () => {
    expect(formatLongDate(DATE, 'id-ID')).toBe('KAMIS, 8 OKTOBER 2026');
  });

  it('formats the upcoming tile month and day', () => {
    expect(formatMonth(DATE, 'id-ID')).toBe('OKT');
    expect(formatDay(DATE)).toBe('08');
  });
});
