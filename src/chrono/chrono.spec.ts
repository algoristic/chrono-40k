import { Chrono } from './chrono';
import { Formats } from './chrono.model';

describe('classic imperial date', () => {
  describe('parser', () => {
    describe('interpretes a date object', () => {
      it('at the beginning of the year', () => {
        const imperialDate = Chrono.parse(new Date('2025-01-01T00:00:00.00Z'));

        expect(imperialDate.check).toBe(0);
        expect(imperialDate.fraction).toBe(1);
        expect(imperialDate.year).toBe(25);
        expect(imperialDate.millenium).toBe(3);
      });

      it('at the before the end of the year', () => {
        const imperialDate = Chrono.parse(new Date('2025-12-31T15:00:00.00Z'));

        expect(imperialDate.check).toBe(0);
        expect(imperialDate.fraction).toBe(999);
        expect(imperialDate.year).toBe(25);
        expect(imperialDate.millenium).toBe(3);
      });

      it('at the end of the year', () => {
        const imperialDate = Chrono.parse(new Date('2025-12-31T23:00:00.00Z'));

        expect(imperialDate.check).toBe(0);
        expect(imperialDate.fraction).toBe(0);
        expect(imperialDate.year).toBe(25);
        expect(imperialDate.millenium).toBe(3);
      });

      it('at the end of a leapyear', () => {
        const imperialDate = Chrono.parse(new Date('2024-12-31T23:00:00.00Z'));

        expect(imperialDate.check).toBe(0);
        expect(imperialDate.fraction).toBe(0);
        expect(imperialDate.year).toBe(24);
        expect(imperialDate.millenium).toBe(3);
      });
    });

    describe('parses a string of well known format', () => {
      it('recognizes the default format', () => {
        const imperialDate = Chrono.parse('0 123 456.M7');
        expect(imperialDate.check).toBe(0);
        expect(imperialDate.fraction).toBe(123);
        expect(imperialDate.year).toBe(456);
        expect(imperialDate.millenium).toBe(7);
      });

      it('recognizes the short format', () => {
        const imperialDate = Chrono.parse('001.M31');
        expect(imperialDate.check).toBe(0);
        expect(imperialDate.fraction).toBe(1);
        expect(imperialDate.year).toBe(1);
        expect(imperialDate.millenium).toBe(31);
      });

      describe('can work with custom formats', () => {
        it('recognizes a arbitrary custom format', () => {
          const imperialDate = Chrono.parse('1234567,M8', 'cfffyyy,m');
          expect(imperialDate.check).toBe(1);
          expect(imperialDate.fraction).toBe(234);
          expect(imperialDate.year).toBe(567);
          expect(imperialDate.millenium).toBe(8);
        });

        it('can work with less padding than the default', () => {
          const imperialDate = Chrono.parse('1 23 04 M5', 'c ff yy m');
          expect(imperialDate.check).toBe(1);
          expect(imperialDate.fraction).toBe(23);
          expect(imperialDate.year).toBe(4);
          expect(imperialDate.millenium).toBe(5);
        });

        it('can work with the lowest amount of padding', () => {
          const imperialDate = Chrono.parse('1 2 34 M5', 'c f y m');
          expect(imperialDate.check).toBe(1);
          expect(imperialDate.fraction).toBe(2);
          expect(imperialDate.year).toBe(34);
          expect(imperialDate.millenium).toBe(5);
        });
      });

      it('throws an error when meeting an unknown format', () => {
        expect(() => Chrono.parse('0123456.M7')).toThrow(Error);
      });
    });

    describe('copies an interface', () => {
      it('throws error when check is negative', () => {
        expect(() =>
          Chrono.parse({
            check: parseInt('-1') as any,
            fraction: 1000,
            year: 25,
            millenium: 3,
          }),
        ).toThrow(Error);
      });

      it('throws error when check is too big', () => {
        expect(() =>
          Chrono.parse({
            check: 10 as any,
            fraction: 1000,
            year: 25,
            millenium: 3,
          }),
        ).toThrow(Error);
      });

      it('throws error when fraction is negative', () => {
        expect(() =>
          Chrono.parse({
            check: 0,
            fraction: -1,
            year: 25,
            millenium: 3,
          }),
        ).toThrow(Error);
      });

      it('throws error when fraction is too big', () => {
        expect(() =>
          Chrono.parse({
            check: 0,
            fraction: 1000,
            year: 25,
            millenium: 3,
          }),
        ).toThrow(Error);
      });

      it('accepts a valid interface', () => {
        const imperialDate = Chrono.parse({
          check: 0,
          fraction: 9,
          year: 25,
          millenium: 3,
        });

        expect(imperialDate.check).toBe(0);
        expect(imperialDate.fraction).toBe(9);
        expect(imperialDate.year).toBe(25);
        expect(imperialDate.millenium).toBe(3);
      });
    });

    describe('converts a date of the indomitus era template', () => {
      it('before the opening of the cicatrix maledictum', () => {
        const date = Chrono.classic.parse(
          Chrono.indomitus.parse('100.0- TCM.M41'),
        );

        expect(date.fraction).toBe(0);
        expect(date.year).toBe(900);
        expect(date.millenium).toBe(41);
      });

      it('after the opening of the cicatrix maledictum', () => {
        const date = Chrono.classic.parse(
          Chrono.indomitus.parse('10.1 post TCM.M41'),
        );

        expect(date.fraction).toBe(1);
        expect(date.year).toBe(10);
        expect(date.millenium).toBe(41);
      });

      it('rejects a date from another location than holy terra', () => {
        expect(() =>
          Chrono.classic.parse(Chrono.indomitus.parse('1.0- VCM.M41')),
        ).toThrow(Error);
      });
    });
  });

  describe('formatter', () => {
    it('formats the full default template', () => {
      expect(
        Chrono.format(
          Chrono.parse({
            check: 0,
            fraction: 123,
            year: 456,
            millenium: 7,
          }),
        ),
      ).toBe('0 123 456.M7');
    });

    it('respects the padding of numbers', () => {
      expect(Chrono.format(new Date('2025-01-04:00:00:00.00Z'))).toBe(
        '0 009 025.M3',
      );
    });

    it('respects the padding of millenia', () => {
      expect(
        Chrono.format({ check: 0, fraction: 99, year: 7, millenium: 0 }),
      ).toBe('0 099 007.M0');
    });

    it('formats the short default template', () => {
      expect(
        Chrono.format(
          new Date('2025-01-01T00:00:00.00Z'),
          Formats.CLASSIC_SHORT_FORMAT,
        ),
      ).toBe('025.M3');
    });

    it('formats a custom template', () => {
      expect(Chrono.format('2025-01-01:00:00:00.00Z', 'cfffyyy.m')).toBe(
        '0001025.M3',
      );
    });

    it('formats an arbitrary template', () => {
      expect(Chrono.format('2025-01-01:00:00:00.00Z', 'cdf-yyy,m (ff)')).toBe(
        '0d1-025,M3 (01)',
      );
    });
  });

  describe('converter', () => {
    it('transforms an imperial date to its terran equivalent (start of the year)', () => {
      const original = new Date('2025-01-01:00:00:00.00Z');
      const conversionResult = Chrono.indomitus.getTerranDate(
        '974.999 previo TCM.M3',
      );
      expect(conversionResult.getUTCFullYear()).toBe(original.getUTCFullYear());
      expect(conversionResult.getUTCMonth()).toBe(original.getUTCMonth());
      expect(conversionResult.getUTCDate()).toBe(original.getUTCDate());
    });

    it('transforms an imperial date to its terran equivalent ("middle" of the year)', () => {
      const date = new Date('2025-01-03:06:00:00.00Z');
      const indomitusDate = Chrono.indomitus.parse(date);
      const conversionResult = Chrono.indomitus.getTerranDate(indomitusDate);
      expect(conversionResult.getUTCFullYear()).toBe(date.getUTCFullYear());
      expect(conversionResult.getUTCMonth()).toBe(date.getUTCMonth());
      expect(conversionResult.getUTCDate()).toBe(date.getUTCDate());
    });

    it('transforms an imperial date to its terran equivalent (end of the year)', () => {
      const date = new Date('2025-12-31:08:00:00.00Z');
      const indomitusDate = Chrono.indomitus.parse(date);
      const conversionResult = Chrono.indomitus.getTerranDate(indomitusDate);
      expect(conversionResult.getUTCFullYear()).toBe(date.getUTCFullYear());
      expect(conversionResult.getUTCMonth()).toBe(date.getUTCMonth());
      expect(conversionResult.getUTCDate()).toBe(date.getUTCDate());
    });

    it('throws an error when transforming a non-terran date', () => {
      expect(() => Chrono.getTerranDate('2 001 025.M3')).toThrow(Error);
    });
  });
});

describe('indomitus era imperial date', () => {
  describe('parser', () => {
    describe('interpretes a date object', () => {
      it('at the beginning of the year', () => {
        const imperialDate = Chrono.indomitus.parse(
          new Date('2025-01-01T00:00:00.00Z'),
        );

        expect(imperialDate.designator).toBe('T');
        expect(imperialDate.chronosegments).toBe(999);
        expect(imperialDate.annualDesignator).toBe(974);
        expect(imperialDate.millenium).toBe(3);
        expect(imperialDate.isPostGreatRift).toBe(false);
      });

      it('before the end of the year', () => {
        const imperialDate = Chrono.indomitus.parse(
          new Date('2025-12-31T15:00:00.00Z'),
        );

        expect(imperialDate.designator).toBe('T');
        expect(imperialDate.chronosegments).toBe(1);
        expect(imperialDate.annualDesignator).toBe(974);
        expect(imperialDate.millenium).toBe(3);
        expect(imperialDate.isPostGreatRift).toBe(false);
      });

      it('at the end of the year', () => {
        const imperialDate = Chrono.indomitus.parse(
          new Date('2025-12-31T23:00:00.00Z'),
        );

        expect(imperialDate.designator).toBe('T');
        expect(imperialDate.chronosegments).toBe(0);
        expect(imperialDate.annualDesignator).toBe(974);
        expect(imperialDate.millenium).toBe(3);
        expect(imperialDate.isPostGreatRift).toBe(false);
      });
    });

    describe('parses a string of well known format', () => {
      it('recognizes the default format', () => {
        const imperialDate = Chrono.indomitus.parse('123.456 post TCM.M7');

        expect(imperialDate.designator).toBe('T');
        expect(imperialDate.chronosegments).toBe(456);
        expect(imperialDate.annualDesignator).toBe(123);
        expect(imperialDate.millenium).toBe(7);
        expect(imperialDate.isPostGreatRift).toBe(true);
      });

      it('recognizes the short format', () => {
        const imperialDate = Chrono.indomitus.parse('0.1+ OPCM.M31');

        expect(imperialDate.designator).toBe('OP');
        expect(imperialDate.chronosegments).toBe(1);
        expect(imperialDate.annualDesignator).toBe(0);
        expect(imperialDate.millenium).toBe(31);
        expect(imperialDate.isPostGreatRift).toBe(true);
      });

      describe('can work with custom formats', () => {
        it('recognizes a given custom format', () => {
          const imperialDate = Chrono.indomitus.parse(
            '04 09 previo VCM(M8)',
            'ff yy gg d(m)',
          );

          expect(imperialDate.designator).toBe('V');
          expect(imperialDate.chronosegments).toBe(4);
          expect(imperialDate.annualDesignator).toBe(9);
          expect(imperialDate.millenium).toBe(8);
          expect(imperialDate.isPostGreatRift).toBe(false);
        });

        it('can work with much more padding than the default', () => {
          const imperialDate = Chrono.indomitus.parse(
            '004 099 previo VCM(M8)',
            'fff yyy gg d(m)',
          );

          expect(imperialDate.designator).toBe('V');
          expect(imperialDate.chronosegments).toBe(4);
          expect(imperialDate.annualDesignator).toBe(99);
          expect(imperialDate.millenium).toBe(8);
          expect(imperialDate.isPostGreatRift).toBe(false);
        });
      });

      it('throws an error when meeting an unknown format', () => {
        expect(() => Chrono.indomitus.parse('0123456.M7')).toThrow(Error);
      });
    });

    describe('copies an interface', () => {
      it('throws error when designator is empty', () => {
        expect(() =>
          Chrono.indomitus.parse({
            designator: '',
            chronosegments: 0,
            annualDesignator: 0,
            millenium: 40,
            isPostGreatRift: false,
          }),
        ).toThrow(Error);
      });

      it('throws error when chronosegments are negative', () => {
        expect(() =>
          Chrono.indomitus.parse({
            designator: 'V',
            chronosegments: -1,
            annualDesignator: 25,
            millenium: 3,
            isPostGreatRift: false,
          }),
        ).toThrow(Error);
      });

      it('throws error when chronosegments are too big', () => {
        expect(() =>
          Chrono.indomitus.parse({
            designator: 'V',
            chronosegments: 1000,
            annualDesignator: 25,
            millenium: 3,
            isPostGreatRift: false,
          }),
        ).toThrow(Error);
      });

      it('accepts a valid interface', () => {
        const imperialDate = Chrono.indomitus.parse({
          designator: 'V',
          chronosegments: 9,
          annualDesignator: 25,
          millenium: 3,
          isPostGreatRift: false,
        });

        expect(imperialDate.designator).toBe('V');
        expect(imperialDate.chronosegments).toBe(9);
        expect(imperialDate.annualDesignator).toBe(25);
        expect(imperialDate.millenium).toBe(3);
        expect(imperialDate.isPostGreatRift).toBe(false);
      });
    });

    describe('converts a classic imperial date to its equivalent', () => {
      it('before the opening of the cicatrix maledictum', () => {
        const date = Chrono.indomitus.parse(
          Chrono.classic.parse('0 001 899.M41'),
        );

        expect(date.chronosegments).toBe(999);
        expect(date.annualDesignator).toBe(100);
        expect(date.millenium).toBe(41);
        expect(date.isPostGreatRift).toBe(false);
      });

      it('after the opening of the cicatrix maledictum', () => {
        const date = Chrono.indomitus.parse(
          Chrono.classic.parse('0 002 009.M42'),
        );

        expect(date.chronosegments).toBe(2);
        expect(date.annualDesignator).toBe(9);
        expect(date.millenium).toBe(42);
        expect(date.isPostGreatRift).toBe(true);
      });

      it('rejects a date from another location than holy terra', () => {
        expect(() =>
          Chrono.indomitus.parse(Chrono.classic.parse('1 010 000.M41')),
        ).toThrow(Error);
      });
    });
  });

  describe('formatter', () => {
    it('formats the full default template', () => {
      expect(
        Chrono.indomitus.format(
          Chrono.indomitus.parse({
            designator: 'V',
            chronosegments: 9,
            annualDesignator: 0,
            millenium: 41,
            isPostGreatRift: true,
          }),
        ),
      ).toBe('0.9 post VCM.M41');
    });

    it('formats the short default template', () => {
      expect(
        Chrono.indomitus.format(
          new Date('2025-01-01T00:00:00.00Z'),
          Formats.INDOMITUS_ERA_SHORT_FORMAT,
        ),
      ).toBe('974.999- TCM.M3');
    });

    it('formats a custom template', () => {
      expect(
        Chrono.indomitus.format('2025-01-01:00:00:00.00Z', 'yyy.fff gg d.m'),
      ).toBe('974.999 previo TCM.M3');
    });
  });
});

describe('both date systems work consistent against each other', () => {
  it('before the opening of the cicatrix maledictum', () => {
    const classicDate = Chrono.classic.parse('0 100 500.M38');
    const indomitusDate = Chrono.indomitus.parse(classicDate);
    const reverse = Chrono.parse(indomitusDate);

    expect(Chrono.format(reverse)).toBe('0 100 500.M38');
  });

  it('after the opening if the cicatrix maledictum', () => {
    const classicDate = Chrono.classic.parse('0 100 200.M42');
    const indomitusDate = Chrono.indomitus.parse(classicDate);
    const reverse = Chrono.classic.parse(indomitusDate);

    expect(Chrono.format(reverse)).toBe('0 100 200.M42');
  });
});
