import { TerranDate } from '../chrono/common/common.model';
import { IndomitusEraDate } from '../chrono/indomitus-era/indomitus-era-calendar.model';
import { convertClassicToTerranDate } from './classic-to-terran';
import { convertIndomitusToClassicDate } from './indomitus-to-classic';

export function convertIndomitusToTerranDate(
  date: IndomitusEraDate,
): TerranDate {
  const classicDate = convertIndomitusToClassicDate(date);
  return convertClassicToTerranDate(classicDate);
}
