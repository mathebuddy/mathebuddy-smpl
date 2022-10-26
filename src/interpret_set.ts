/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { SMPL_Interpreter } from './interpret';

import { Set_INT } from './set';

export class SMPL_Interpreter_Set {
  private parent: SMPL_Interpreter = null;

  constructor(parent: SMPL_Interpreter) {
    this.parent = parent;
  }

  //G set(elements:INT_LIST): SET_INT -> _createSet;
  _createSet(elements: number[]): Set_INT {
    const s = new Set_INT();
    s.elements = elements;
    return s;
  }

  //G len(s:SET_INT): INT -> _lenSet;
  _lenSet(s: Set_INT): number {
    return s.elements.length;
  }
}
