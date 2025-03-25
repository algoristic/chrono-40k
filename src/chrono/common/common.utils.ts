import { ClassicDate } from '../classic/classic-calendar.model';
import { IndomitusEraDate } from '../indomitus-era/indomitus-era-calendar.model';
import { Millenium, TerranDate } from './common.model';

const MARCO_CONST = 1 / ((365 * 24) / 1000);
const MARCO_CONST_LEAPYEAR = 1 / ((366 * 24) / 1000);
const ONE_DAY = 1000 * 60 * 60 * 24;

export function parseMillenium(milleniumValue: string): Millenium {
  milleniumValue = milleniumValue.substring(1);
  return parseInt(milleniumValue);
}

export function isClassicImperialDate(
  date: string | TerranDate | IndomitusEraDate | ClassicDate,
): date is ClassicDate {
  return typeof date === 'object' && 'check' in date;
}

export function isIndomitusEraImperialDate(
  date: string | TerranDate | IndomitusEraDate | ClassicDate,
): date is IndomitusEraDate {
  return typeof date === 'object' && 'designator' in date;
}

export function isTerranDate(
  date: string | TerranDate | IndomitusEraDate | ClassicDate,
): date is TerranDate {
  return date instanceof Date;
}

export function isString(
  date: string | TerranDate | IndomitusEraDate | ClassicDate,
): date is string {
  return typeof date === 'string';
}

export function getFraction(date: TerranDate): number {
  const day = getDayOfYear(date);
  const hours = date.getUTCHours();
  const determinedHour = day * 24 + hours;

  const year = date.getUTCFullYear();
  let fraction = Math.trunc(determinedHour * getMarcoConstant(year)) + 1;
  if (fraction === 1000) {
    fraction = 0;
  }
  return fraction;
}

export function getYear(date: TerranDate): number {
  return date.getUTCFullYear() % 1000;
}

export function getMillenium(date: TerranDate): number {
  let millenium = date.getUTCFullYear() / 1000;
  millenium += 1;
  return Math.trunc(millenium);
}

export function getMarcoConstant(year: number): number {
  return isLeapYear(year) ? MARCO_CONST_LEAPYEAR : MARCO_CONST;
}

function getDayOfYear(date: TerranDate): number {
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear;
  return Math.floor(diff / ONE_DAY) - 1;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
