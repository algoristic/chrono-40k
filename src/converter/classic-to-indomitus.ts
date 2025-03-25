import { ClassicImperialCalendar } from '../chrono/classic/classic-calendar';
import { ClassicDate } from '../chrono/classic/classic-calendar.model';
import { IndomitusEraDate } from '../chrono/indomitus-era/indomitus-era-calendar.model';
import { indomitusEraImperialDateFactory } from '../chrono/indomitus-era/indomitus-era-calendar.utils';
import { calculateDateDifference } from './common/common.utils';

export function convertClassicToIndomitusDate(
  date: ClassicDate,
): IndomitusEraDate {
  if (date.check !== 0) {
    throw new Error(
      'Cannot infer designator for other location than holy terra',
    );
  }
  const base = ClassicImperialCalendar.GREAT_RIFT_OPENING;
  const dateDiff = calculateDateDifference(base, date);
  const indomitusEraDate = indomitusEraImperialDateFactory();
  const isPostGreatRift = dateDiff.years < 0 || dateDiff.fractions < 0;

  indomitusEraDate.annualDesignator = Math.abs(dateDiff.years % 1000);
  indomitusEraDate.chronosegments = Math.abs(dateDiff.fractions);
  indomitusEraDate.isPostGreatRift = isPostGreatRift;
  indomitusEraDate.millenium = Math.trunc(
    base.millenium - (dateDiff.years / 1000 - 1),
  );

  return indomitusEraDate;
}
