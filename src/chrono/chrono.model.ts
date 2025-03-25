import { ClassicDate } from './classic/classic-calendar.model';
import { IndomitusEraDate } from './indomitus-era/indomitus-era-calendar.model';

export type ImperialDate = ClassicDate | IndomitusEraDate;
export interface DateSegment<T extends ImperialDate> {
  symbol: string;
  expression: string;
  format: (date: T) => string;
  parse: (date: T, value: string) => void;
}

export enum Formats {
  CLASSIC_DEFAULT_FORMAT = 'c fff yyy.m',
  CLASSIC_SHORT_FORMAT = 'yyy.m',
  INDOMITUS_ERA_DEFAULT_FORMAT = 'y.f gg d.m',
  INDOMITUS_ERA_SHORT_FORMAT = 'y.fg d.m',
}
