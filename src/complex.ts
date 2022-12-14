/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as mathjs from 'mathjs';

export class Complex {
  real: number;
  imag: number;

  constructor(real = 0, imag = 0) {
    this.real = real;
    this.imag = imag;
  }

  clone(): Complex {
    return new Complex(this.real, this.imag);
  }

  mulReal(value: number): void {
    this.real *= value;
    this.imag *= value;
  }

  static mathjs2complex(c: mathjs.Complex): Complex {
    return new Complex(c.re, c.im);
  }

  static complex2mathjs(c: Complex): mathjs.Complex {
    return mathjs.complex(c.real, c.imag);
  }

  toMathJs(): mathjs.Complex {
    return Complex.complex2mathjs(this);
  }

  toString(): string {
    if (this.imag >= 0) return this.real + '+' + this.imag + 'i';
    else return this.real + '-' + -this.imag + 'i';
  }
}
