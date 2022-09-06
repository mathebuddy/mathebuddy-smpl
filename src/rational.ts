/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

export class Rational {
  n: number; // nominator
  d: number; // denominator

  constructor(n = 0, d = 0) {
    this.n = n;
    this.d = d;
  }
}
