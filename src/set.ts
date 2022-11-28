/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Complex } from './complex';

// TODO: consolidate classes Set_INT and Set_REAL

export class Set_INT {
  elements: number[] = [];

  constructor(numbers: number[] = []) {
    this.elements = numbers;
  }

  add(value: number): void {
    if (this.elements.includes(value) == false) this.elements.push(value);
  }

  min(): number {
    let m = Infinity;
    for (const e of this.elements) {
      if (e < m) m = e;
    }
    return m;
  }

  max(): number {
    let m = -Infinity;
    for (const e of this.elements) {
      if (e > m) m = e;
    }
    return m;
  }

  toString(): string {
    let s = '{';
    s += this.elements.sort().join(',');
    s += '}';
    return s;
  }
}

export class Set_REAL {
  elements: number[] = [];

  constructor(numbers: number[] = []) {
    this.elements = numbers;
  }

  add(value: number): void {
    if (this.elements.includes(value) == false) this.elements.push(value);
  }

  min(): number {
    let m = Infinity;
    for (const e of this.elements) {
      if (e < m) m = e;
    }
    return m;
  }

  max(): number {
    let m = -Infinity;
    for (const e of this.elements) {
      if (e > m) m = e;
    }
    return m;
  }

  toString(): string {
    let s = '{';
    s += this.elements.sort().join(','); // TODO: sort does not work!!
    s += '}';
    return s;
  }
}

export class Set_COMPLEX {
  elements: Complex[] = [];

  constructor(numbers: Complex[] = []) {
    this.elements = numbers;
  }

  add(value: Complex): void {
    // TODO: check, if value already exists!!
    this.elements.push(value);
  }

  toString(): string {
    let s = '{';
    s += this.elements.join(',');
    s += '}';
    return s;
  }
}
