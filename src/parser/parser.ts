import { DateSegment, ImperialDate } from '../chrono/chrono.model';
import { TerranDate } from '../chrono/common/common.model';
import { bySymbol, getFormatExpression } from './parser.utils';

export class ImperialDateParser<T extends ImperialDate> {
  private formatExpressions: RegExp[];

  constructor(
    formats: string[],
    private segments: DateSegment<T>[],
    private dateFactory: () => T,
    private dateConverter: (date: TerranDate) => T,
  ) {
    this.formatExpressions = formats.map(getFormatExpression(this.segments));
  }

  parse(date: string): T {
    for (let regex of this.formatExpressions) {
      const execArray = regex.exec(date);
      if (!(execArray && execArray.groups)) {
        continue;
      }

      return this.match(execArray.groups);
    }

    const terranDate: TerranDate = new Date(date);

    if (terranDate instanceof Date && isNaN(terranDate.getTime())) {
      throw new Error('Date did not match any expected pattern');
    }

    return this.dateConverter(terranDate);
  }

  private match(captureGroups: Record<string, string>): T {
    const imperialDate = this.dateFactory();
    for (const [symbol, value] of Object.entries(captureGroups)) {
      const segment = this.segments.find(bySymbol(symbol));
      if (!segment) {
        continue;
      }

      segment.parse(imperialDate, value);
    }

    return imperialDate;
  }
}
