/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

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
}
