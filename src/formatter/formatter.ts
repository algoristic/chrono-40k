import { DateSegment, ImperialDate } from '../chrono/chrono.model';

export class ImperialDateFormatter<T extends ImperialDate> {
  constructor(
    private pattern: string,
    private segments: DateSegment<T>[],
  ) {}

  format(date: T): string {
    let formattedDate = this.pattern;
    for (const { symbol, format } of this.segments) {
      formattedDate = formattedDate.replace(
        new RegExp(symbol, 'g'),
        format(date),
      );
    }

    return formattedDate;
  }
}
