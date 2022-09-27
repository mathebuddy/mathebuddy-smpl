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

  //G _add(x:COMPLEX,y:COMPLEX):COMPLEX -> _addComplex;
  _addComplex(x: Complex, y: Complex): Complex {
    return Complex.mathjs2complex(mathjs.add(x.toMathJs(), y.toMathJs()));
  }

  //G _sub(x:COMPLEX,y:COMPLEX):COMPLEX -> _subComplex;
  _subComplex(x: Complex, y: Complex): Complex {
    return Complex.mathjs2complex(mathjs.subtract(x.toMathJs(), y.toMathJs()));
  }

  //G exp(x:COMPLEX):COMPLEX -> _expComplex;
  // TODO

  //G sqrt(x:COMPLEX): COMPLEX -> _sqrtComplex;
  // TODO

  //G abs(x:COMPLEX): REAL -> _absComplex;
  _absComplex(x: Complex): number {
    //TODO return mathjs.abs(Complex.complex2mathjs(x));
    return 0;
  }
}
