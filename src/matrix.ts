/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as mathjs from 'mathjs';
import { Vector } from './vector';

export class Matrix {
  private rows = 1;
  private cols = 1;
  private values: number[] = [];

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.values = new Array(rows * cols).fill(0);
  }

  getRows(): number {
    return this.rows;
  }

  getCols(): number {
    return this.cols;
  }

  setValue(row: number, col: number, v: number): void {
    this.values[row * this.cols + col] = v;
  }

  getValue(row: number, col: number): number {
    return this.values[row * this.cols + col];
  }

  getCol(idx: number): Vector {
    const v = new Vector(this.rows);
    for (let i = 0; i < this.rows; i++) {
      v.setValue(i, this.getValue(i, idx));
    }
    return v;
  }

  clone(): Matrix {
    const m = new Matrix(this.rows, this.cols);
    m.values = [...this.values];
    return m;
  }

  toString(): string {
    let s = '[';
    for (let i = 0; i < this.rows; i++) {
      if (i > 0) s += ',';
      s += '[';
      for (let j = 0; j < this.cols; j++) {
        if (j > 0) s += ',';
        s += this.getValue(i, j);
      }
      s += ']';
    }
    s += ']';
    return s;
  }

  static mathjs2matrix(m: mathjs.Matrix): Matrix {
    const result = new Matrix(m.size()[0], m.size()[1]);
    const rows = result.getRows();
    const cols = result.getCols();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result.setValue(i, j, m.get([i, j]));
      }
    }
    return result;
  }

  static matrix2mathjs(m: Matrix): mathjs.Matrix {
    const result = mathjs.zeros(m.rows, m.cols) as mathjs.Matrix;
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        result.set([i, j], m.getValue(i, j));
      }
    }
    return result;
  }

  is_zero(epsilon = 1e-9): boolean {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.abs(this.getValue(i, j)) > epsilon) {
          return false;
        }
      }
    }
    return true;
  }
}
