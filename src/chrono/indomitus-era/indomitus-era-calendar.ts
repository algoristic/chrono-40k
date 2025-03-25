import { convertClassicToIndomitusDate } from '../../converter/classic-to-indomitus';
import { convertIndomitusToTerranDate } from '../../converter/indomitus-to-terran';
import { convertTerranToIndomitusDate } from '../../converter/terran-to-indomitus';
import { ImperialDateFormatter } from '../../formatter/formatter';
import { ImperialDateParser } from '../../parser/parser';
import { Formats } from '../chrono.model';
import { ClassicDate } from '../classic/classic-calendar.model';
import { TerranDate } from '../common/common.model';
import {
  isClassicImperialDate,
  isIndomitusEraImperialDate,
  isString,
  isTerranDate,
} from '../common/common.utils';
import {
  IndomitusEraDate,
  IndomitusEraImperialDate,
  indomitusEraImperialDateSegments,
} from './indomitus-era-calendar.model';
import { indomitusEraImperialDateFactory } from './indomitus-era-calendar.utils';

export class IndomitusEraImperialCalendar {
  parse(date: TerranDate): IndomitusEraImperialDate;
  parse(date: IndomitusEraDate): IndomitusEraImperialDate;
  parse(date: ClassicDate): IndomitusEraImperialDate;
  parse(date: string, format?: string): IndomitusEraImperialDate;
  parse(
    date: string | TerranDate | IndomitusEraDate | ClassicDate,
    format?: string,
  ): IndomitusEraImperialDate {
    return this.internalParse(date, format);
  }

  format(date: string, format?: string): string;
  format(date: TerranDate, format?: string): string;
  format(date: IndomitusEraDate, format?: string): string;
  format(date: ClassicDate, format?: string): string;
  format(
    date: string | TerranDate | IndomitusEraDate | ClassicDate,
    format?: string,
  ): string {
    const proxy = this.internalParse(date);

    if (typeof format === 'undefined') {
      format = Formats.INDOMITUS_ERA_DEFAULT_FORMAT;
    }

    const formatter = new ImperialDateFormatter(
      format,
      indomitusEraImperialDateSegments,
    );
    return formatter.format(proxy);
  }

  isValid(date: IndomitusEraDate): boolean {
    const { designator, chronosegments } = date;
    if (designator === '') {
      return false;
    }
    if (chronosegments < 0 || 999 < chronosegments) {
      return false;
    }
    return true;
  }

  getTerranDate(date: IndomitusEraDate): TerranDate;
  getTerranDate(date: string, format?: string): TerranDate;
  getTerranDate(date: string | IndomitusEraDate, format?: string): TerranDate {
    const proxy = this.internalParse(date, format);
    return convertIndomitusToTerranDate(proxy);
  }

  private internalParse(
    date: string | TerranDate | IndomitusEraDate | ClassicDate,
    format?: string,
  ): IndomitusEraImperialDate {
    let indomitusEraDate: IndomitusEraDate | undefined = undefined;

    if (isString(date)) {
      indomitusEraDate = this.fromString(date, format);
    }

    if (isIndomitusEraImperialDate(date)) {
      indomitusEraDate = this.fromIndomitusEraImperialDate(date);
    }

    if (isTerranDate(date)) {
      indomitusEraDate = this.fromTerranDate(date);
    }

    if (isClassicImperialDate(date)) {
      indomitusEraDate = this.fromClassicImperialDate(date);
    }

    if (!indomitusEraDate) {
      throw new Error('Type mismatch on input');
    }

    return {
      ...indomitusEraDate,
      toString: (format?: string) => this.format(indomitusEraDate, format),
      toDate: () => this.getTerranDate(indomitusEraDate),
    };
  }

  private fromString(date: string, format?: string): IndomitusEraDate {
    const formats = [
      Formats.INDOMITUS_ERA_DEFAULT_FORMAT.valueOf(),
      Formats.INDOMITUS_ERA_SHORT_FORMAT.valueOf(),
    ];
    if (format) {
      formats.push(format);
    }

    const parser = new ImperialDateParser<IndomitusEraDate>(
      formats,
      indomitusEraImperialDateSegments,
      indomitusEraImperialDateFactory,
      convertTerranToIndomitusDate,
    );
    return parser.parse(date);
  }

  private fromTerranDate(date: TerranDate): IndomitusEraDate {
    return convertTerranToIndomitusDate(date);
  }

  private fromIndomitusEraImperialDate(
    date: IndomitusEraDate,
  ): IndomitusEraDate {
    if (!this.isValid(date)) {
      throw new Error('Invalid date');
    }

    return { ...date };
  }

  private fromClassicImperialDate(date: ClassicDate): IndomitusEraDate {
    return convertClassicToIndomitusDate(date);
  }
}
