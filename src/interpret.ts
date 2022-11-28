/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

/**
 * This file interprets SELL code.
 */

import { BaseType, SymTabEntry } from './symbol';
import { Matrix } from './matrix';
import { Term } from './term';
import { SMPL_Interpreter_Vector } from './interpret_vector';
import { SMPL_Interpreter_Matrix } from './interpret_matrix';
import { SMPL_Interpreter_Complex } from './interpret_complex';
import { SMPL_Interpreter_Basic } from './interpret_basic';
import { SMPL_Interpreter_Term } from './interpret_term';
import { SMPL_Interpreter_Set } from './interpret_set';
import { Set_COMPLEX, Set_INT } from './set';
import { Vector } from './vector';
import { Complex } from './complex';

export class RunError extends Error {
  constructor(srcPos: string, msg: string) {
    super('' + srcPos + ':' + msg);
    this.name = 'RunError';
  }
}

export class SMPL_Interpreter {
  interpret_vector: SMPL_Interpreter_Vector = null;
  interpret_matrix: SMPL_Interpreter_Matrix = null;
  interpret_complex: SMPL_Interpreter_Complex = null;
  interpret_basic: SMPL_Interpreter_Basic = null;
  interpret_term: SMPL_Interpreter_Term = null;
  interpret_set: SMPL_Interpreter_Set = null;

  public constructor() {
    this.interpret_vector = new SMPL_Interpreter_Vector(this);
    this.interpret_matrix = new SMPL_Interpreter_Matrix(this);
    this.interpret_complex = new SMPL_Interpreter_Complex(this);
    this.interpret_basic = new SMPL_Interpreter_Basic(this);
    this.interpret_term = new SMPL_Interpreter_Term(this);
    this.interpret_set = new SMPL_Interpreter_Set(this);
  }

  public interpret(code: string, locals: SymTabEntry[]): void {
    // TODO: prevent infinite loops
    code += 'return [';
    let i = 0;
    for (const local of locals) {
      if (local.type.base == BaseType.TERM_VAR) continue;
      if (i > 0) code += ', ';
      code += local.id;
      i++;
    }
    code += '];';
    const f = new Function('runtime', code);
    try {
      const values: (
        | boolean
        | number
        | Complex
        | Set_INT
        | Set_COMPLEX
        | Term
        | Vector
        | Matrix
      )[] = f(this);
      for (let i = 0; i < locals.length; i++) {
        const local = locals[i];
        switch (local.type.base) {
          case BaseType.BOOL:
            local.value = values[i] as boolean;
            break;
          case BaseType.INT:
          case BaseType.REAL:
            local.value = values[i] as number;
            break;
          case BaseType.COMPLEX:
            local.value = values[i] as Complex;
            break;
          case BaseType.VECTOR:
            local.value = values[i] as Vector;
            break;
          case BaseType.MATRIX:
            local.value = values[i] as Matrix;
            break;
          case BaseType.TERM:
            local.value = values[i] as Term;
            break;
          case BaseType.INT_SET:
            local.value = values[i] as Set_INT;
            break;
          case BaseType.COMPLEX_SET:
            local.value = values[i] as Set_COMPLEX;
            break;
          default:
            throw new RunError(
              '-1',
              'interpret(..): unimplemented type ' + local.type,
            );
        }
      }
    } catch (e) {
      throw new RunError('-1', 'interpret(..) failed: ' + e);
    }
  }
}
