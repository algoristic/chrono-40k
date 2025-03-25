# Chrono 40k

> A consistent dating system for "Warhammer 40,000"

If you are not familiar with the imperial dating system in Warhammer 40k please consider to first take a look at https://warhammer40k.fandom.com/wiki/Imperial_Dating_System.

I intentionally diverge from the calculation of the _year fraction_ or _chronosegments_, more on that in the [remark](#remark) section.

## Usage

### Basic usage:

Get imperial representations of `Date`:

```ts
import { Chrono, Formats } from 'chrono-40k';

Chrono.classic.format(new Date());
// returns something like "0 227 025.M3"

Chrono.classic.format(new Date(), Formats.CLASSIC_SHORT_FORMAT);
// returns something like "025.M3"

Chrono.indomitus.format(new Date());
// returns something like "974.773 previo TCM.M3"

Chrono.indomitus.format(new Date(), Formats.INDOMITUS_ERA_SHORT_FORMAT);
// returns something like "974.773- TCM.M3"
```

Get `Date`s for imperial dates:

```ts
let date: Date = Chrono.classic.parse('005.M30').toDate();
// or
date = Chrono.classic.toTerranDate('005.M30');
```

Use imperial date objects:

```ts
const classicDate = Chrono.classic.parse(new Date());

console.log(classicDate.toString());
const date: Date = classicDate.toDate();

const indomitusDate = Chrono.indomitus.parse(classicDate);
```

Use short access to imperial dates:

```ts
let classicDate = Chrono.classic.parse(new Date());
// equals
classicDate = Chrono.parse(new Date());

console.log(Chrono.classic.format(new Date()));
// equals
console.log(Chrono.format(new Date()));

// etc.
```

### Advanced usage

Convert from one imperial dating system the other:

```ts
const classicDate = Chrono.classic.parse('0 899 998.M41');
console.log(Chrono.indomitus.format(classicDate));
// outputs "1.101 previo TCM.M42"
```

#### Custom formatting

`Chrono.classic` automatically recognizes imperial dates in the formats

- `c fff yyy.m` (`Formats.CLASSIC_DEFAULT_FORMAT`) \
  e. g. "0 550 899.M41" and
- `yyy.m` (`Formats.CLASSIC_SHORT_FORMAT`) \
  e. g. "005.M30"

where `c` = check number, `f` = year fraction, `y` = year and `m` = millenium.

`Chrono.indomitus` automatically recognizes imperial dates into the formats

- `y.f gg d.m` (`Formats.INDOMITUS_ERA_DEFAULT_FORMAT`) \
  e. g. "1.1 previo TCM.M41" and
- `y.fg d.m` (`Formats.INDOMITUS_ERA_SHOR_FORMAT`) \
  e. g. "0.110+ TCM.M42"

where `y` = annual designator, `f` = chronosegments, `g`/`gg` = +/- or post/previo opening of the Cicatrix Maledictum, `d` = designator initials and `m` = millenium.

If needed, a custom format can be provided to any method that parses or formats and imperial date string:

```ts
Chrono.classic.parse('0123456  M7', 'cfffyyy m');
Chrono.classic.format(new Date(), 'yyy,m');
```

For more examples please take a look at the [`chrono.spec.ts`](./src/chrono/chrono.spec.ts)

## Remark

I intentionally diverge from the calculation of the _year fraction_ (and the respective _chronosegments_ in the "Era Indomitus" dating system) as I see a problem with the lore accurate calculation.

### Problem

The first issue is that the fixed _Makr constant_ does not take into account leap years. We need at least one "default" constant and one for leap years.

The second and more fundamental issue is that, even when not considering leap years, the calculation with the _Makr constant_ just does not work.

E. g. calculate the _year fractions_ for December 31, 2025 at 10 pm. December 31st is day number 365 of the year 2025 and 10pm is the 22th hour of that day so we calculate **365 \* 24 + 22 = 8782**. Then we multiply that with the _Makr constant_ **8782 \* 0.11407955 = 1001.84661** and round down the result to get the **year fraction = 1001**.

This is a problematic result as we just have 1000 _year fractions_ in a year, so even when resolving this problem by just capping the result at 1000 we do not get a consistent way to calculate dates in both directions.

### Solution

In my calculation I replace the _Makr constant_ with two variations of the new _Marco constant_, one "default" and one for leap years.

**marco_constant_default = 1 / ( ( 365 \* 24 ) / 1000 )**
**marco_constant_leap_year = 1 / ( ( 366 \* 24 ) / 1000 )**

With theses adjustments the dating system does not work lore accurate anymore but it allows for a consistent conversion between gregorian and imperial dates.

## Copyright

This software is completely unofficial and in no way endorsed by Games Workshop Ltd.
