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
import { Vector } from './vector';

export class SMPL_Interpreter_Matrix {
  private parent: SMPL_Interpreter = null;

  constructor(parent: SMPL_Interpreter) {
    this.parent = parent;
  }

  _create(row_count: number, col_count: number, elements: number[]): Matrix {
    const matrix = new Matrix(row_count, col_count);
    let k = 0;
    for (let i = 0; i < row_count; i++) {
      for (let j = 0; j < col_count; j++) {
        matrix.setValue(i, j, elements[k++]);
      }
    }
    return matrix;
  }

  _getElement(x: Matrix, row: number, col: number, ERR_POS: string): number {
    if (row < 0 || row >= x.getRows())
      throw new RunError(
        ERR_POS,
        'matrix has ' + x.getRows() + ' rows. Cannot get row ' + row,
      );
    if (col < 0 || col >= x.getCols())
      throw new RunError(
        ERR_POS,
        'matrix has ' + x.getCols() + ' columns. Cannot get column ' + col,
      );
    return x.getValue(row, col);
  }

  _setElement(
    x: Matrix,
    row: number,
    col: number,
    value: number,
    ERR_POS: string,
  ): void {
    if (row < 0 || row >= x.getRows())
      throw new RunError(
        ERR_POS,
        'matrix has ' + x.getRows() + ' rows. Cannot get row ' + row,
      );
    if (col < 0 || col >= x.getCols())
      throw new RunError(
        ERR_POS,
        'matrix has ' + x.getCols() + ' columns. Cannot get column ' + col,
      );
    x.setValue(row, col, value);
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

  //G _mul(x:INT,y:MATRIX):MATRIX -> _mulScalarMatrix;
  //G _mul(x:REAL,y:MATRIX):MATRIX -> _mulScalarMatrix;
  _mulScalarMatrix(x: number, y: Matrix): Matrix {
    const z = mathjs.multiply(x, Matrix.matrix2mathjs(y));
    return Matrix.mathjs2matrix(z);
  }

  //G _mul(x: MATRIX, y: INT): MATRIX -> _mulMatrixScalar;
  //G _mul(x: MATRIX, y: REAL): MATRIX -> _mulMatrixScalar;
  _mulMatrixScalar(x: Matrix, y: number): Matrix {
    const z = mathjs.multiply(Matrix.matrix2mathjs(x), y);
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

  //G zeros<rows:INT,columns:INT>(): MATRIX -> _zeros;
  _zeros(rows: number, cols: number): Matrix {
    const m = new Matrix(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        m.setValue(i, j, 0);
      }
    }
    return m;
  }

  //G ones<rows:INT,columns:INT>(): MATRIX -> _ones;
  _ones(rows: number, cols: number): Matrix {
    const m = new Matrix(rows, cols);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        m.setValue(i, j, 1);
      }
    }
    return m;
  }

  //G transpose(x:MATRIX): MATRIX -> _transposeMatrix;
  _transposeMatrix(x: Matrix): Matrix {
    const y = Matrix.mathjs2matrix(mathjs.transpose(Matrix.matrix2mathjs(x)));
    return y;
  }

  //G linsolve(A:MATRIX,b:VECTOR): VECTOR -> _linsolve;
  _linsolve(A: Matrix, b: Vector): Vector {
    // TODO: catch errors
    const x = Matrix.mathjs2matrix(
      mathjs.lusolve(Matrix.matrix2mathjs(A), Vector.vector2list(b)),
    );
    return x.getCol(0);
  }

  //G is_zero(x:MATRIX): BOOL -> _isMatrixZero;
  _isMatrixZero(x: Matrix): boolean {
    return x.is_zero(1e-9); // TODO: configure epsilon
  }
}
