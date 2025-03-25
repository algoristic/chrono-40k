import { DateSegment } from '../chrono.model';
import { Millenium, TerranDate } from '../common/common.model';
import { parseMillenium } from '../common/common.utils';
import {
  parseCheck,
  parseYear,
  parseYearFraction,
} from './classic-calendar.utils';

export type Check = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type YearFraction = number;
export type Year = number;

export interface ClassicDate {
  check: Check;
  fraction: YearFraction;
  year: Year;
  millenium: Millenium;
}

export interface ClassicImperialDate extends ClassicDate {
  toString: (format?: string) => string;
  toDate: () => TerranDate;
}

export const classicImperialDateSegments: DateSegment<ClassicDate>[] = [
  {
    symbol: 'c',
    expression: '(?<c>\\d)',
    format: (date) => `${date.check}`,
    parse: (date, check) => (date.check = parseCheck(check)),
  },
  {
    symbol: 'fff',
    expression: '(?<fff>\\d{3})',
    format: (date) => `${date.fraction}`.padStart(3, '0'),
    parse: (date, fraction) => (date.fraction = parseYearFraction(fraction)),
  },
  {
    symbol: 'ff',
    expression: '(?<ff>\\d{2,3})',
    format: (date) => `${date.fraction}`.padStart(2, '0'),
    parse: (date, fraction) => (date.fraction = parseYearFraction(fraction)),
  },
  {
    symbol: 'f',
    expression: '(?<f>\\d{1,3})'.padStart(1, '0'),
    format: (date) => `${date.fraction}`,
    parse: (date, fraction) => (date.fraction = parseYearFraction(fraction)),
  },
  {
    symbol: 'yyy',
    expression: '(?<yyy>\\d{3})',
    format: (date) => `${date.year}`.padStart(3, '0'),
    parse: (date, year) => (date.year = parseYear(year)),
  },
  {
    symbol: 'yy',
    expression: '(?<yy>\\d{2,3})',
    format: (date) => `${date.year}`.padStart(2, '0'),
    parse: (date, year) => (date.year = parseYear(year)),
  },
  {
    symbol: 'y',
    expression: '(?<y>\\d{1,3})',
    format: (date) => `${date.year}`.padStart(1, '0'),
    parse: (date, year) => (date.year = parseYear(year)),
  },
  {
    symbol: 'm',
    expression: '(?<m>M\\d+)',
    format: (date) => `M${date.millenium}`.padEnd(2, '0'),
    parse: (date, millenium) => (date.millenium = parseMillenium(millenium)),
  },
];
