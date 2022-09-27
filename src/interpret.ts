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

import { BaseType, SymTabEntry } from './symbol';
import { Matrix } from './matrix';
import { Term } from './term';
import { Complex } from './complex';

export class RunError extends Error {
  constructor(srcPos: string, msg: string) {
    super('' + srcPos + ':' + msg);
    this.name = 'RunError';
  }
}

export class SMPL_Interpreter {
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
      const values: (boolean | number | Term | Matrix)[] = f(this);
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
            local.value = values[i] as Matrix;
            break;
          case BaseType.TERM_VAR:
            // do nothing
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

  private _add(x: number, y: number): number {
    return x + y;
  }

  private _addComplex(x: Complex, y: Complex): Complex {
    return Complex.mathjs2complex(mathjs.add(x.toMathJs(), y.toMathJs()));
  }

  private _unaryMinus(x: number): number {
    return -x;
  }

  private _unaryNot(x: boolean): boolean {
    return !x;
  }

  private _sub(x: number, y: number): number {
    return x - y;
  }

  private _subComplex(x: Complex, y: Complex): Complex {
    return Complex.mathjs2complex(mathjs.subtract(x.toMathJs(), y.toMathJs()));
  }

  private _mul(x: number, y: number): number {
    return x * y;
  }

  private _div(x: number, y: number): number {
    return x / y;
  }

  private _pow(x: number, y: number): number {
    return Math.pow(x, y);
  }

  private _addMatrices(x: Matrix, y: Matrix, ERR_POS: string): Matrix {
    let z: mathjs.Matrix;
    try {
      z = mathjs.add(Matrix.matrix2mathjs(x), Matrix.matrix2mathjs(y));
    } catch (e) {
      throw new RunError(ERR_POS, 'dimensions do not match');
    }
    return Matrix.mathjs2matrix(z);
  }

  private _subMatrices(x: Matrix, y: Matrix, ERR_POS: string): Matrix {
    let z: mathjs.Matrix;
    try {
      z = mathjs.subtract(Matrix.matrix2mathjs(x), Matrix.matrix2mathjs(y));
    } catch (e) {
      throw new RunError(ERR_POS, 'dimensions do not match');
    }
    return Matrix.mathjs2matrix(z);
  }

  private _mulMatrices(x: Matrix, y: Matrix, ERR_POS: string): Matrix {
    let z: mathjs.Matrix;
    try {
      z = mathjs.multiply(Matrix.matrix2mathjs(x), Matrix.matrix2mathjs(y));
    } catch (e) {
      throw new RunError(ERR_POS, 'dimensions do not match');
    }
    return Matrix.mathjs2matrix(z);
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

  private _randMatrix(
    rows: number,
    cols: number,
    min: number,
    max: number,
  ): Matrix {
    const m = new Matrix(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        m.setValue(i, j, this._randIntMinMax(min, max));
      }
    }
    return m;
  }

  private _randZMatrix(
    rows: number,
    cols: number,
    min: number,
    max: number,
  ): Matrix {
    const m = new Matrix(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        m.setValue(i, j, this._randIntMinMaxZ(min, max));
      }
    }
    return m;
  }

  private _det(x: Matrix, ERR_POS: string): number {
    try {
      return mathjs.det(Matrix.matrix2mathjs(x));
    } catch (e) {
      throw new RunError(ERR_POS, 'matrix is not square');
    }
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

  /*private _zeros(rows: number, cols: number): mathjs.MathCollection {
    return mathjs.zeros([rows, cols]);
  }

  private _ones(rows: number, cols: number): mathjs.MathCollection {
    return mathjs.ones([rows, cols]);
  }*/
}
