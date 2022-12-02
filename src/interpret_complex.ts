/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as mathjs from 'mathjs';

import { RunError, SMPL_Interpreter } from './interpret';
import { Complex } from './complex';

export class SMPL_Interpreter_Complex {
  private parent: SMPL_Interpreter = null;

  constructor(parent: SMPL_Interpreter) {
    this.parent = parent;
  }

  _create(real: number, imag: number): Complex {
    return new Complex(real, imag);
  }

  //G _unaryMinus(x:COMPLEX):COMPLEX -> _unaryMinusComplex;
  _unaryMinusComplex(x: Complex): Complex {
    return new Complex(-x.real, -x.imag);
  }

  //G _add(x:COMPLEX,y:COMPLEX):COMPLEX -> _addComplex;
  _addComplex(x: Complex, y: Complex): Complex {
    return Complex.mathjs2complex(mathjs.add(x.toMathJs(), y.toMathJs()));
  }

  //G _add(x:INT, y:COMPLEX): COMPLEX -> _addNumberComplex;
  //G _add(x:REAL, y:COMPLEX): COMPLEX -> _addNumberComplex;
  _addNumberComplex(x: number, y: Complex): Complex {
    return new Complex(x + y.real, y.imag);
  }

  //G _add(x:COMPLEX, y:INT): COMPLEX -> _addComplexNumber;
  //G _add(x:COMPLEX, y:REAL): COMPLEX -> _addComplexNumber;
  _addComplexNumber(x: Complex, y: number): Complex {
    return new Complex(x.real + y, x.imag);
  }

  //G _sub(x:COMPLEX,y:COMPLEX):COMPLEX -> _subComplex;
  _subComplex(x: Complex, y: Complex): Complex {
    return Complex.mathjs2complex(mathjs.subtract(x.toMathJs(), y.toMathJs()));
  }

  //G _sub(x:INT, y:COMPLEX): COMPLEX -> _subNumberComplex;
  //G _sub(x:REAL, y:COMPLEX): COMPLEX -> _subNumberComplex;
  _subNumberComplex(x: number, y: Complex): Complex {
    return new Complex(x - y.real, -y.imag);
  }

  //G _sub(x:COMPLEX, y:INT): COMPLEX -> _subComplexNumber;
  //G _sub(x:COMPLEX, y:REAL): COMPLEX -> _subComplexNumber;
  _subComplexNumber(x: Complex, y: number): Complex {
    return new Complex(x.real - y, x.imag);
  }

  //G _mul(x:COMPLEX,y:COMPLEX):COMPLEX -> _mulComplex;
  _mulComplex(x: Complex, y: Complex): Complex {
    return Complex.mathjs2complex(
      mathjs.multiply(x.toMathJs(), y.toMathJs()) as mathjs.Complex,
    );
  }

  //G _div(x:COMPLEX,y:COMPLEX):COMPLEX -> _divComplex;
  _divComplex(x: Complex, y: Complex): Complex {
    return Complex.mathjs2complex(
      mathjs.divide(x.toMathJs(), y.toMathJs()) as mathjs.Complex,
    );
  }

  //G _mul(x:INT,y:COMPLEX):COMPLEX -> _mulNumberComplex;
  //G _mul(x:REAL,y:COMPLEX):COMPLEX -> _mulNumberComplex;
  _mulNumberComplex(x: number, y: Complex): Complex {
    const z = y.clone();
    z.mulReal(x);
    return z;
  }

  //G _mul(x:COMPLEX,y:INT):COMPLEX -> _mulComplexNumber;
  //G _mul(x:COMPLEX,y:REAL):COMPLEX -> _mulComplexNumber;
  _mulComplexNumber(x: Complex, y: number): Complex {
    const z = x.clone();
    z.mulReal(y);
    return z;
  }

  //G _pow(x:COMPLEX,y:COMPLEX):COMPLEX -> _powComplexComplex;
  _powComplexComplex(x: Complex, y: Complex): Complex {
    return Complex.mathjs2complex(
      mathjs.pow(
        Complex.complex2mathjs(x),
        Complex.complex2mathjs(y),
      ) as mathjs.Complex,
    );
  }

  //G _pow(x:COMPLEX, y:INT):COMPLEX -> _powComplexNumber;
  //G _pow(x:COMPLEX, y:REAL):COMPLEX -> _powComplexNumber;
  _powComplexNumber(x: Complex, y: number): Complex {
    return Complex.mathjs2complex(
      mathjs.pow(Complex.complex2mathjs(x), y) as mathjs.Complex,
    );
  }

  //G _pow(x:INT,y:COMPLEX):COMPLEX -> _powNumberComplex;
  //G _pow(x:REAL,y:COMPLEX):COMPLEX -> _powNumberComplex;
  _powNumberComplex(x: number, y: Complex): Complex {
    return Complex.mathjs2complex(
      mathjs.pow(x, Complex.complex2mathjs(y)) as mathjs.Complex,
    );
  }

  //G conj(x:COMPLEX):COMPLEX -> _conjComplex;
  _conjComplex(x: Complex): Complex {
    return new Complex(x.real, -x.imag);
  }

  //G complex(x:INT,y:INT):COMPLEX -> _complex;
  //G complex(x:INT,y:REAL):COMPLEX -> _complex;
  //G complex(x:REAL,y:INT):COMPLEX -> _complex;
  //G complex(x:REAL,y:REAL):COMPLEX -> _complex;
  _complex(x: number, y: number): Complex {
    return new Complex(x, y);
  }

  //G real(x:COMPLEX): REAL -> _extractComplexReal;
  _extractComplexReal(x: Complex): number {
    return x.real;
  }

  //G imag(x:COMPLEX): REAL -> _extractComplexImag;
  _extractComplexImag(x: Complex): number {
    return x.imag;
  }

  //G sqrtC(x:INT): COMPLEX -> _sqrtC_number;
  //G sqrtC(x:REAL): COMPLEX -> _sqrtC_number;
  _sqrtC_number(x: number): Complex {
    if (x >= 0) return new Complex(Math.sqrt(x), 0);
    else return new Complex(0, Math.sqrt(x));
  }

  //G sqrtC(x:COMPLEX): COMPLEX -> _sqrtC_complex;
  _sqrtC_complex(x: Complex): Complex {
    return Complex.mathjs2complex(
      mathjs.sqrt(Complex.complex2mathjs(x)) as mathjs.Complex,
    );
  }

  //G abs(x:COMPLEX): REAL -> _absComplex;
  _absComplex(x: Complex): number {
    return Math.sqrt(x.real * x.real + x.imag * x.imag);
  }
}
