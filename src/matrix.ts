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

  static equal(u: Matrix, v: Matrix, epsilon = 1e-9): boolean {
    if (u.getRows() != v.getRows()) return false;
    if (u.getCols() != v.getCols()) return false;
    const rows = u.getRows();
    const cols = u.getCols();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (Math.abs(u.getValue(i, j) - v.getValue(i, j)) > epsilon)
          return false;
      }
    }
    return true;
  }

  floor(): void {
    const rows = this.getRows();
    const cols = this.getCols();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.setValue(i, j, Math.floor(this.getValue(i, j)));
      }
    }
  }

  ceil(): void {
    const rows = this.getRows();
    const cols = this.getCols();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.setValue(i, j, Math.ceil(this.getValue(i, j)));
      }
    }
  }

  round(): void {
    const rows = this.getRows();
    const cols = this.getCols();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        this.setValue(i, j, Math.round(this.getValue(i, j)));
      }
    }
  }

  static mod(m: Matrix, v: number): Matrix {
    const result = m.clone();
    const rows = result.getRows();
    const cols = result.getCols();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result.setValue(i, j, result.getValue(i, j) % v);
      }
    }
    return result;
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

  is_integer(): boolean {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const value = this.getValue(i, j);
        if (Math.abs(value - Math.round(value)) != 0) {
          return false;
        }
      }
    }
    return true;
  }

  is_symmetric(): boolean {
    if (this.rows != this.cols) return false;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.getValue(i, j) != this.getValue(j, i)) {
          return false;
        }
      }
    }
    return true;
  }

  rank(epsilon = 1e-12): number {
    // implementation based on https://cp-algorithms.com/linear_algebra/rank-matrix.html
    // TODO: test cases
    const A = this.clone();
    const m = A.rows;
    const n = A.cols;
    let rank = 0;
    const row_selected: boolean[] = [];
    for (let k = 0; k < n; k++) row_selected.push(false);
    for (let i = 0; i < m; i++) {
      let j;
      for (j = 0; j < n; j++) {
        if (!row_selected[j] && Math.abs(A.getValue(i, j)) > epsilon) {
          break;
        }
      }
      if (j != n) {
        rank++;
        row_selected[j] = true;
        for (let p = i + 1; p < m; p++) {
          A.setValue(p, j, A.getValue(p, j) / A.getValue(i, j));
        }
        for (let k = 0; k < n; k++) {
          if (k != j && Math.abs(A.getValue(i, k)) > epsilon) {
            for (let p = i + 1; p < m; p++) {
              A.setValue(
                p,
                k,
                A.getValue(p, k) - A.getValue(p, j) * A.getValue(i, k),
              );
            }
          }
        }
      }
    }
    return rank;
  }
}
