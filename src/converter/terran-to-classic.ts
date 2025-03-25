import { ClassicDate } from '../chrono/classic/classic-calendar.model';
import { TerranDate } from '../chrono/common/common.model';
import {
  getFraction,
  getMillenium,
  getYear,
} from '../chrono/common/common.utils';

export function convertTerranToClassicDate(date: TerranDate): ClassicDate {
  const check = 0;
  const fraction = getFraction(date);
  const year = getYear(date);
  const millenium = getMillenium(date);
  return { check, fraction, year, millenium };
}
