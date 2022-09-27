/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as mathjs from 'mathjs';
import { RunError, SMPL_Interpreter } from './interpret';

import { Matrix } from './matrix';

export class SMPL_Interpreter_Matrix {
  private parent: SMPL_Interpreter = null;

  constructor(parent: SMPL_Interpreter) {
    this.parent = parent;
  }

  //G _add(x:MATRIX,y:MATRIX):MATRIX -> _addMatrices;
  _addMatrices(x: Matrix, y: Matrix, ERR_POS: string): Matrix {
    let z: mathjs.Matrix;
    try {
      z = mathjs.add(Matrix.matrix2mathjs(x), Matrix.matrix2mathjs(y));
    } catch (e) {
      throw new RunError(ERR_POS, 'dimensions do not match');
    }
    return Matrix.mathjs2matrix(z);
  }

  //G _sub(x:MATRIX,y:MATRIX):MATRIX -> _subMatrices;
  _subMatrices(x: Matrix, y: Matrix, ERR_POS: string): Matrix {
    let z: mathjs.Matrix;
    try {
      z = mathjs.subtract(Matrix.matrix2mathjs(x), Matrix.matrix2mathjs(y));
    } catch (e) {
      throw new RunError(ERR_POS, 'dimensions do not match');
    }
    return Matrix.mathjs2matrix(z);
  }

  //G _mul(x:MATRIX,y:MATRIX):MATRIX -> _mulMatrices;
  _mulMatrices(x: Matrix, y: Matrix, ERR_POS: string): Matrix {
    let z: mathjs.Matrix;
    try {
      z = mathjs.multiply(Matrix.matrix2mathjs(x), Matrix.matrix2mathjs(y));
    } catch (e) {
      throw new RunError(ERR_POS, 'dimensions do not match');
    }
    return Matrix.mathjs2matrix(z);
  }

  //G rand<rows:INT,columns:INT>(min:INT,max:INT): MATRIX -> _randMatrix;
  _randMatrix(rows: number, cols: number, min: number, max: number): Matrix {
    const m = new Matrix(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        m.setValue(i, j, this.parent.interpret_basic._randIntMinMax(min, max));
      }
    }
    return m;
  }

  //G randZ<rows:INT,columns:INT>(min:INT,max:INT): MATRIX -> _randZMatrix;
  _randZMatrix(rows: number, cols: number, min: number, max: number): Matrix {
    const m = new Matrix(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        m.setValue(i, j, this.parent.interpret_basic._randIntMinMaxZ(min, max));
      }
    }
    return m;
  }

  //G det(x:MATRIX): REAL -> _det;
  _det(x: Matrix, ERR_POS: string): number {
    try {
      return mathjs.det(Matrix.matrix2mathjs(x));
    } catch (e) {
      throw new RunError(ERR_POS, 'matrix is not square');
    }
  }

  //G min(x:MATRIX): REAL -> _minMatrix;
  _minMatrix(x: Matrix): number {
    return mathjs.min(Matrix.matrix2mathjs(x));
  }

  //G max(x:MATRIX): REAL -> _maxMatrix;
  _maxMatrix(x: Matrix): number {
    return mathjs.max(Matrix.matrix2mathjs(x));
  }

  /*_zeros(rows: number, cols: number): mathjs.MathCollection {
    return mathjs.zeros([rows, cols]);
  }

  _ones(rows: number, cols: number): mathjs.MathCollection {
    return mathjs.ones([rows, cols]);
  }*/
}
