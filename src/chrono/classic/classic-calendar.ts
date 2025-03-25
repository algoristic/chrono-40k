import { convertClassicToTerranDate } from '../../converter/classic-to-terran';
import { convertIndomitusToClassicDate } from '../../converter/indomitus-to-classic';
import { convertTerranToClassicDate } from '../../converter/terran-to-classic';
import { ImperialDateFormatter } from '../../formatter/formatter';
import { ImperialDateParser } from '../../parser/parser';
import { Formats } from '../chrono.model';
import { TerranDate } from '../common/common.model';
import {
  isClassicImperialDate,
  isIndomitusEraImperialDate,
  isString,
  isTerranDate,
} from '../common/common.utils';
import { IndomitusEraDate } from '../indomitus-era/indomitus-era-calendar.model';
import {
  ClassicDate,
  ClassicImperialDate,
  classicImperialDateSegments,
} from './classic-calendar.model';
import { classicImperialDateFactory } from './classic-calendar.utils';

export class ClassicImperialCalendar {
  static readonly GREAT_RIFT_OPENING = new ClassicImperialCalendar().parse(
    '0 000 999.M41',
  );

  parse(date: TerranDate): ClassicImperialDate;
  parse(date: ClassicDate): ClassicImperialDate;
  parse(date: IndomitusEraDate): ClassicImperialDate;
  parse(date: string, format?: string): ClassicImperialDate;
  parse(
    date: string | TerranDate | ClassicDate | IndomitusEraDate,
    format?: string,
  ): ClassicImperialDate {
    return this.internalParse(date, format);
  }

  format(date: string, format?: string): string;
  format(date: TerranDate, format?: string): string;
  format(date: ClassicDate, format?: string): string;
  format(date: string | TerranDate | ClassicDate, format?: string): string {
    const proxy = this.internalParse(date, format);

    if (typeof format === 'undefined') {
      format = Formats.CLASSIC_DEFAULT_FORMAT;
    }

    const formatter = new ImperialDateFormatter(
      format,
      classicImperialDateSegments,
    );
    return formatter.format(proxy);
  }

  isValid(date: ClassicDate): boolean {
    const { check, fraction } = date;
    if (check < 0 || 9 < check) {
      return false;
    }
    if (fraction < 0 || 999 < fraction) {
      return false;
    }
    return true;
  }

  getTerranDate(date: ClassicDate): TerranDate;
  getTerranDate(date: string, format?: string): TerranDate;
  getTerranDate(date: string | ClassicDate, format?: string): TerranDate {
    const proxy = this.internalParse(date, format);
    return convertClassicToTerranDate(proxy);
  }

  private internalParse(
    date: string | TerranDate | ClassicDate | IndomitusEraDate,
    format?: string,
  ): ClassicImperialDate {
    let classicDate: ClassicDate | undefined = undefined;
    if (isString(date)) {
      classicDate = this.fromString(date, format);
    }

    if (isClassicImperialDate(date)) {
      classicDate = this.fromClassicImperialDate(date);
    }

    if (isIndomitusEraImperialDate(date)) {
      classicDate = this.fromIndomitusEraDate(date);
    }

    if (isTerranDate(date)) {
      classicDate = this.fromTerranDate(date);
    }

    if (!classicDate) {
      throw new Error('Type mismatch on input');
    }

    return {
      ...classicDate,
      toString: (format?: string) => this.format(classicDate, format),
      toDate: () => this.getTerranDate(classicDate),
    };
  }

  private fromString(date: string, format?: string): ClassicDate {
    const formats = [
      Formats.CLASSIC_DEFAULT_FORMAT.valueOf(),
      Formats.CLASSIC_SHORT_FORMAT.valueOf(),
    ];
    if (format) {
      formats.push(format);
    }

    const parser = new ImperialDateParser<ClassicDate>(
      formats,
      classicImperialDateSegments,
      classicImperialDateFactory,
      convertTerranToClassicDate,
    );
    return parser.parse(date);
  }

  private fromTerranDate(date: TerranDate): ClassicDate {
    return convertTerranToClassicDate(date);
  }

  private fromClassicImperialDate(date: ClassicDate): ClassicDate {
    if (!this.isValid(date)) {
      throw new Error('Invalid date');
    }

    return { ...date };
  }

  private fromIndomitusEraDate(date: IndomitusEraDate): ClassicDate {
    return convertIndomitusToClassicDate(date);
  }
}
