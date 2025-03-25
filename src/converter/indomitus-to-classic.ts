import { ClassicImperialCalendar } from '../chrono/classic/classic-calendar';
import { ClassicDate } from '../chrono/classic/classic-calendar.model';
import { IndomitusEraDate } from '../chrono/indomitus-era/indomitus-era-calendar.model';
import { getTotalFractions, inferDate } from './common/common.utils';

export function convertIndomitusToClassicDate(
  date: IndomitusEraDate,
): ClassicDate {
  if (date.designator !== 'T') {
    throw new Error(
      'Cannot infer date check for event that did not happen on holy terra',
    );
  }
  const base = ClassicImperialCalendar.GREAT_RIFT_OPENING;

  let fraction = date.chronosegments;
  let years = date.annualDesignator;
  let millenia = -(base.millenium - date.millenium);
  if (!date.isPostGreatRift) {
    fraction = -fraction;
    years = -years;
  } else {
    millenia = millenia - 1;
  }
  const targetTotalFractions = millenia * 1000 * 1000 + years * 1000 + fraction;
  const baseTotalFractions = getTotalFractions(base);

  const totalFractions = baseTotalFractions + targetTotalFractions;
  return inferDate(totalFractions);
}
