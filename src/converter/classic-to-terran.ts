import { ClassicDate } from '../chrono/classic/classic-calendar.model';
import { TerranDate } from '../chrono/common/common.model';
import { getMarcoConstant } from '../chrono/common/common.utils';

export function convertClassicToTerranDate(date: ClassicDate): TerranDate {
  const { check, fraction, year, millenium } = date;

  if (check !== 0) {
    throw new Error(
      'Cannot directly convert from non-terran date to terran date',
    );
  }

  const fullYear = (millenium - 1) * 1000 + year;

  const marcoConstant = getMarcoConstant(fullYear);
  let determinedHour = (fraction - 1) / marcoConstant;
  if (fraction === 0) {
    determinedHour = 999 / marcoConstant;
  }

  const dayOfYear = Math.floor(determinedHour / 24);
  const hours = Math.floor(determinedHour % 24);

  const startOfYear = new Date(Date.UTC(fullYear, 0, 1));
  startOfYear.setUTCDate(startOfYear.getUTCDate() + dayOfYear);
  startOfYear.setUTCHours(hours, 0, 0, 0);
  return startOfYear;
}
