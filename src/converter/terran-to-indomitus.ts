import { TerranDate } from '../chrono/common/common.model';
import { IndomitusEraDate } from '../chrono/indomitus-era/indomitus-era-calendar.model';
import { convertClassicToIndomitusDate } from './classic-to-indomitus';
import { convertTerranToClassicDate } from './terran-to-classic';

export function convertTerranToIndomitusDate(
  date: TerranDate,
): IndomitusEraDate {
  const classicDate = convertTerranToClassicDate(date);
  return convertClassicToIndomitusDate(classicDate);
}
