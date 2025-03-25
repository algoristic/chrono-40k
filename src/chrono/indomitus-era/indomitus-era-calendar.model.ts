import { DateSegment } from '../chrono.model';
import { Millenium, TerranDate } from '../common/common.model';
import { parseMillenium } from '../common/common.utils';
import {
  parseAnnualDesignator,
  parseChronosegments,
  parseDesignator,
} from './indomitus-era-calendar.utils';

export type Chronosegments = number;
export type AnnualDesignator = number;
export type Designator = string;

export interface IndomitusEraDate {
  chronosegments: Chronosegments;
  annualDesignator: AnnualDesignator;
  millenium: Millenium;
  designator: Designator;
  isPostGreatRift: boolean;
}

export interface IndomitusEraImperialDate extends IndomitusEraDate {
  toString: (format?: string) => string;
  toDate: () => TerranDate;
}

export const indomitusEraImperialDateSegments: DateSegment<IndomitusEraDate>[] =
  [
    {
      symbol: 'd',
      expression: '(?<d>\\w+CM)',
      format: (date) => `${date.designator}CM`,
      parse: (date, designator) =>
        (date.designator = parseDesignator(designator)),
    },
    {
      symbol: 'fff',
      expression: '(?<fff>\\d{3})',
      format: (date) => `${date.chronosegments}`.padStart(3, '0'),
      parse: (date, chronosegments) =>
        (date.chronosegments = parseChronosegments(chronosegments)),
    },
    {
      symbol: 'ff',
      expression: '(?<ff>\\d{2,3})',
      format: (date) => `${date.chronosegments}`.padStart(2, '0'),
      parse: (date, chronosegments) =>
        (date.chronosegments = parseChronosegments(chronosegments)),
    },
    {
      symbol: 'f',
      expression: '(?<f>\\d{1,3})',
      format: (date) => `${date.chronosegments}`.padStart(1, '0'),
      parse: (date, chronosegments) =>
        (date.chronosegments = parseChronosegments(chronosegments)),
    },
    {
      symbol: 'yyy',
      expression: '(?<yyy>\\d{3})',
      format: (date) => `${date.annualDesignator}`.padStart(3, '0'),
      parse: (date, annualDesignator) =>
        (date.annualDesignator = parseAnnualDesignator(annualDesignator)),
    },
    {
      symbol: 'yy',
      expression: '(?<yy>\\d{2,3})',
      format: (date) => `${date.annualDesignator}`.padStart(2, '0'),
      parse: (date, annualDesignator) =>
        (date.annualDesignator = parseAnnualDesignator(annualDesignator)),
    },
    {
      symbol: 'y',
      expression: '(?<y>\\d{1,3})',
      format: (date) => `${date.annualDesignator}`.padStart(1, '0'),
      parse: (date, annualDesignator) =>
        (date.annualDesignator = parseAnnualDesignator(annualDesignator)),
    },
    {
      symbol: 'm',
      expression: '(?<m>M\\d+)',
      format: (date) => `M${date.millenium}`.padEnd(2, '0'),
      parse: (date, millenium) => (date.millenium = parseMillenium(millenium)),
    },
    {
      symbol: 'gg',
      expression: '(?<gg>(post|previo))',
      format: (date) => (date.isPostGreatRift ? 'post' : 'previo'),
      parse: (date, timeDesignator) =>
        (date.isPostGreatRift = timeDesignator === 'post'),
    },
    {
      symbol: 'g',
      expression: '(?<g>[+-])',
      format: (date) => (date.isPostGreatRift ? '+' : '-'),
      parse: (date, timeDesignator) =>
        (date.isPostGreatRift = timeDesignator === '+'),
    },
  ];
