import { DateSegment, ImperialDate } from '../chrono/chrono.model';

export function getFormatExpression<T extends ImperialDate>(
  segments: DateSegment<T>[],
): (pattern: string) => RegExp {
  return (pattern: string) => {
    let expression = escapeControlSequences(pattern);
    const placeholders: Record<string, string> = {};
    for (const [index, segment] of segments.entries()) {
      const replacement = segment.expression;
      const placeholder = `_PLACEHOLDER_${index}_`;
      placeholders[placeholder] = replacement;
      expression = expression.replace(
        new RegExp(segment.symbol, 'g'),
        placeholder,
      );
    }
    for (const [placeholder, replacement] of Object.entries(placeholders)) {
      expression = expression.replace(
        new RegExp(placeholder, 'g'),
        replacement,
      );
    }
    return new RegExp(`^${expression}$`);
  };
}

export function bySymbol<T extends ImperialDate>(symbol: string) {
  return (segment: DateSegment<T>) => segment.symbol === symbol;
}

function escapeControlSequences(pattern: string): string {
  return pattern
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}');
}
