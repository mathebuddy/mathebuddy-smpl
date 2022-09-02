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

import * as mathjs from 'mathjs';

import { BaseType, Matrix, SymTabEntry } from './symbol';

export class RunError extends Error {
  constructor(srcRow: number, srcCol: number, msg: string) {
    super('' + srcRow + ':' + srcCol + ':' + msg);
    this.name = 'RunError';
  }
}

export class SMPL_Interpreter {
  public interpret(code: string, locals: SymTabEntry[]): void {
    // TODO: prevent infinite loops
    code += 'return [';
    let i = 0;
    for (const local of locals) {
      if (i > 0) code += ', ';
      code += local.id;
      i++;
    }
    code += '];';
    const f = new Function('runtime', code);
    try {
      const values: (boolean | number | mathjs.Matrix)[] = f(this);
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
          case BaseType.MATRIX:
            local.value = this._mathjsMatrix2Matrix(values[i] as mathjs.Matrix);
            break;
          default:
            throw new RunError(
              -1,
              -1,
              'interpret(..): unimplemented type ' + local.type,
            );
        }
      }
    } catch (e) {
      throw new RunError(-1, -1, 'interpret(..) failed: ' + e);
    }
  }

  private _mathjsMatrix2Matrix(m: mathjs.Matrix): Matrix {
    const r = new Matrix(m.size()[0], m.size()[1]);
    for (let i = 0; i < r.rows; i++) {
      for (let j = 0; j < r.cols; j++) {
        r.setValue(i, j, m.get([i, j]));
      }
    }
    return r;
  }

  private _randIntMax(max: number): number {
    return Math.floor(Math.random() * max);
  }

  private _randIntMinMax(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  private _randIntMinMaxZ(min: number, max: number): number {
    let r = 0;
    while (r == 0) r = this._randIntMinMax(min, max);
    return r;
  }

  private _sin(x: number): number {
    return Math.sin(x);
  }

  private _cos(x: number): number {
    return Math.cos(x);
  }

  private _tan(x: number): number {
    return Math.tan(x);
  }

  private _asin(x: number): number {
    return Math.asin(x);
  }

  private _acos(x: number): number {
    return Math.acos(x);
  }

  private _atan(x: number): number {
    return Math.atan(x);
  }

  private _exp(x: number): number {
    return Math.exp(x);
  }

  private _sqrt(x: number): number {
    return Math.sqrt(x);
  }

  private _zeros(rows: number, cols: number): mathjs.MathCollection {
    return mathjs.zeros([rows, cols]);
  }

  private _ones(rows: number, cols: number): mathjs.MathCollection {
    return mathjs.ones([rows, cols]);
  }

  private _addMatrices(
    a: mathjs.MathCollection,
    b: mathjs.MathCollection,
    srcRow: number,
    srcCol: number,
  ): mathjs.MathCollection {
    let c: mathjs.MathCollection;
    try {
      c = mathjs.add(a, b);
    } catch (e) {
      throw new RunError(srcRow, srcCol, 'dimensions do not match');
    }
    return c;
  }
}
