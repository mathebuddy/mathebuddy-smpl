/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

//import * as mathjs from 'mathjs';

export class Set_INT {
  elements: number[] = [];

  constructor(numbers: number[] = []) {
    this.elements = numbers;
  }

  toString(): string {
    let s = '{';
    s += this.elements.sort().join(',');
    s += '}';
    return s;
  }
}
