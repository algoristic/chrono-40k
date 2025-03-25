import { ClassicDate } from '../../chrono/classic/classic-calendar.model';
import { DateDifference } from '../../chrono/common/common.model';

export function calculateDateDifference(
  from: ClassicDate,
  to: ClassicDate,
): DateDifference {
  const minuend = getTotalFractions(from);
  const subtrahend = getTotalFractions(to);
  const difference = minuend - subtrahend;

  const years = Math.trunc(difference / 1000);
  const fractions = difference % 1000;
  return { years, fractions };
}

export function inferDate(totalFractions: number): ClassicDate {
  const check = 0;
  const fraction = totalFractions % 1000;
  const year = Math.trunc((totalFractions % (1000 * 1000)) / 1000);
  const millenium = Math.trunc(totalFractions / (1000 * 1000)) + 1;
  return { check, fraction, year, millenium };
}

export function getTotalFractions({
  fraction,
  year,
  millenium,
}: ClassicDate): number {
  return (
    (fraction === 0 ? 1000 : fraction) +
    year * 1000 +
    (millenium - 1) * 1000 * 1000
  );
}
