import {
  Check,
  ClassicDate,
  Year,
  YearFraction,
} from './classic-calendar.model';

export function classicImperialDateFactory(): ClassicDate {
  return {
    check: 0,
    fraction: 1,
    year: 0,
    millenium: 0,
  };
}

export function parseCheck(checkValue: string): Check {
  const check = parseInt(checkValue);
  if (check < 0 || 9 < check) {
    throw new Error(`check ${check} is out of bounds`);
  }
  return check as Check;
}

export function parseYearFraction(fractionValue: string): YearFraction {
  return parseInt(fractionValue);
}

export function parseYear(yearValue: string): Year {
  return parseInt(yearValue);
}
