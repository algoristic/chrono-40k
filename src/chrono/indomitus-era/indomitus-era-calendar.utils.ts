import {
  AnnualDesignator,
  Chronosegments,
  Designator,
  IndomitusEraDate,
} from './indomitus-era-calendar.model';

export function indomitusEraImperialDateFactory(): IndomitusEraDate {
  return {
    designator: 'T',
    chronosegments: 1,
    annualDesignator: 0,
    millenium: 0,
    isPostGreatRift: true,
  };
}

export function parseChronosegments(
  chronosegmentsValue: string,
): Chronosegments {
  return parseInt(chronosegmentsValue);
}

export function parseAnnualDesignator(
  annualDesignartorValue: string,
): AnnualDesignator {
  return parseInt(annualDesignartorValue);
}

export function parseDesignator(designatorValue: string): Designator {
  return designatorValue.slice(0, -2).toLocaleUpperCase();
}
