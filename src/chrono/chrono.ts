import { ClassicImperialCalendar } from './classic/classic-calendar';
import { IndomitusEraImperialCalendar } from './indomitus-era/indomitus-era-calendar';

export class Chrono {
  /**
   * Calendar for handling dates in the old style (pre-great rift) of the imperial dating system
   *
   * E. g.:
   * - "0 000 999.M41"
   * - "005.M30"
   */
  static classic = new ClassicImperialCalendar();
  /**
   * Calendar for handling dates in the old style (post-great rift) of the imperial dating system
   *
   * E. g.:
   * - 0.1 previo VCM.M41
   * - 1.1+ TCM.M41
   */
  static indomitus = new IndomitusEraImperialCalendar();

  static parse = Chrono.classic.parse.bind(Chrono.classic);
  static format = Chrono.classic.format.bind(Chrono.classic);
  static valid = Chrono.classic.isValid.bind(Chrono.classic);
  static getTerranDate = Chrono.classic.getTerranDate.bind(Chrono.classic);
}
