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

  _clone(x: Matrix): Matrix {
    return x.clone();
  }

  //G _equal(x:MATRIX, y:MATRIX): BOOL -> _equalMatrices;
  _equalMatrices(x: Matrix, y: Matrix): boolean {
    return Matrix.equal(x, y);
  }

  //G _unequal(x:MATRIX, y:MATRIX): BOOL -> _unequalMatrices;
  _unequalMatrices(x: Matrix, y: Matrix): boolean {
    return Matrix.equal(x, y) == false;
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

  //G eye(n:INT): MATRIX -> _eye;
  _eye(n: number): Matrix {
    const x = new Matrix(n, n);
    for (let i = 0; i < n; i++) {
      x.setValue(i, i, 1);
    }
    return x;
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

  //G floor(x:MATRIX): MATRIX -> _floorMatrix;
  _floorMatrix(x: Matrix): Matrix {
    const res = x.clone();
    res.floor();
    return res;
  }

  //G ceil(x:MATRIX): MATRIX -> _ceilMatrix;
  _ceilMatrix(x: Matrix): Matrix {
    const res = x.clone();
    res.ceil();
    return res;
  }

  //G round(x:MATRIX): MATRIX -> _roundMatrix;
  _roundMatrix(x: Matrix): Matrix {
    const res = x.clone();
    res.round();
    return res;
  }

  //G transpose(x:MATRIX): MATRIX -> _transposeMatrix;
  _transposeMatrix(x: Matrix): Matrix {
    const y = Matrix.mathjs2matrix(mathjs.transpose(Matrix.matrix2mathjs(x)));
    return y;
  }

  //G triu(x:MATRIX): MATRIX -> _triu;
  _triu(x: Matrix): Matrix {
    const y = x.clone();
    for (let i = 0; i < y.getRows(); i++) {
      for (let j = 0; j < y.getCols(); j++) {
        if (i > j) y.setValue(i, j, 0);
      }
    }
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

  //G matrix(v:VECTOR_LIST): MATRIX -> _matrixFromVectors;
  _matrixFromVectors(v: Vector[], ERR_POS: string): Matrix {
    const n = v.length;
    if (n == 0) throw new RunError(ERR_POS, 'no vector given');
    let m = -1;
    for (let i = 0; i < n; i++) {
      if (i == 0) m = v[0].getSize();
      else if (v[i].getSize() != m)
        throw new RunError(ERR_POS, 'vector lengths differ');
    }
    const A = new Matrix(m, n);
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        A.setValue(i, j, v[j].getValue(i));
      }
    }
    return A;
  }

  //G rank(A:MATRIX): INT -> _rank;
  _rank(A: Matrix): number {
    return A.rank();
  }

  //G is_zero(x:MATRIX): BOOL -> _isMatrixZero;
  _isMatrixZero(x: Matrix): boolean {
    return x.is_zero(1e-9); // TODO: configure epsilon
  }

  //G is_symmetric(x:MATRIX): BOOL -> _isMatrixSymmetric;
  _isMatrixSymmetric(x: Matrix, ERR_POS: string): boolean {
    if (x.getRows() != x.getCols())
      throw new RunError(ERR_POS, 'matrix is not symmetric');
    return x.is_symmetric();
  }

  //G is_invertible(x:MATRIX): BOOL -> _isMatrixInvertible;
  _isMatrixInvertible(x: Matrix, ERR_POS: string): boolean {
    if (x.getRows() != x.getCols())
      throw new RunError(ERR_POS, 'matrix is not symmetric');
    const det = mathjs.det(Matrix.matrix2mathjs(x));
    return Math.abs(det) > 1e-9; // TODO: make epsilon adjustable
  }

  //G inv(x:MATRIX): MATRIX -> _invMatrix;
  _invMatrix(x: Matrix, ERR_POS: string): Matrix {
    if (this._isMatrixInvertible(x, ERR_POS) == false)
      throw new RunError(ERR_POS, 'matrix is not invertible');
    return Matrix.mathjs2matrix(mathjs.inv(Matrix.matrix2mathjs(x)));
  }

  //G _mod(x:MATRIX,y:INT):MATRIX -> _modMatrix;
  _modMatrix(x: Matrix, y: number, ERR_POS: string): Matrix {
    if (x.is_integer() == false)
      throw new RunError(ERR_POS, 'matrix is not integral');
    return Matrix.mod(x, y);
  }

  //G column(x:MATRIX, c:INT): VECTOR -> _matrixColumn;
  _matrixColumn(x: Matrix, c: number, ERR_POS: string): Vector {
    if (c < 0 || c >= x.getCols())
      throw new RunError(ERR_POS, 'invalid column');
    const v = new Vector(x.getRows());
    for (let i = 0; i < x.getRows(); i++) {
      v.setValue(i, x.getValue(i, c));
    }
    return v;
  }

  //G row(x:MATRIX, r:INT): VECTOR -> _matrixRow;
  _matrixRow(x: Matrix, r: number, ERR_POS: string): Vector {
    if (r < 0 || r >= x.getRows()) throw new RunError(ERR_POS, 'invalid row');
    const v = new Vector(x.getCols());
    for (let i = 0; i < x.getCols(); i++) {
      v.setValue(i, x.getValue(r, i));
    }
    return v;
  }
}
