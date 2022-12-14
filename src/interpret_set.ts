/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Complex } from './complex';
import { SMPL_Interpreter } from './interpret';

import { Set_COMPLEX, Set_INT, Set_REAL } from './set';

export class SMPL_Interpreter_Set {
  private parent: SMPL_Interpreter = null;

  constructor(parent: SMPL_Interpreter) {
    this.parent = parent;
  }

  //G set(elements:INT_LIST): SET_INT -> _createIntSet;
  _createIntSet(elements: number[]): Set_INT {
    const s = new Set_INT();
    for (const element of elements) {
      s.add(element);
    }
    return s;
  }

  //G set(elements:REAL_LIST): SET_REAL -> _createRealSet;
  _createRealSet(elements: number[]): Set_REAL {
    const s = new Set_REAL();
    for (const element of elements) {
      s.add(element);
    }
    return s;
  }

  //G set(elements:COMPLEX_LIST): SET_COMPLEX -> _createComplexSet;
  _createComplexSet(elements: Complex[]): Set_COMPLEX {
    const s = new Set_COMPLEX();
    for (const element of elements) {
      s.add(element);
    }
    return s;
  }

  //G max(s:SET_INT): INT -> _maxSetInt;
  _maxSetInt(s: Set_INT): number {
    return s.max();
  }

  //G max(s:SET_REAL): REAL -> _maxSetReal;
  _maxSetReal(s: Set_REAL): number {
    return s.max();
  }

  //G min(s:SET_INT): INT -> _minSetInt;
  _minSetInt(s: Set_INT): number {
    return s.min();
  }

  //G min(s:SET_REAL): REAL -> _minSetReal;
  _minSetReal(s: Set_REAL): number {
    return s.min();
  }

  //G len(s:SET_INT): INT -> _lenSet;
  _lenSet(s: Set_INT): number {
    return s.elements.length;
  }

  //G rand(s:SET_INT): INT -> _randIntSet;
  _randIntSet(s: Set_INT): number {
    return s.elements[Math.floor(Math.random() * s.elements.length)];
  }
}
