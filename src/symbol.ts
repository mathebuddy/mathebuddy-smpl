/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

export class Matrix {
  rows = 1;
  cols = 1;
  values: number[] = [];
  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.values = new Array(rows * cols).fill(0);
  }
  setValue(row: number, col: number, v: number): void {
    this.values[row * this.cols + col] = v;
  }
  getValue(row: number, col: number): number {
    return this.values[row * this.cols + col];
  }
}

export enum BaseType {
  BOOL = 'BOOL',
  INT = 'INT',
  REAL = 'REAL',
  IMAG = 'IMAG',
  COMPLEX = 'COMPLEX',
  TERM = 'TERM',
  MATRIX = 'MATRIX',
  FUNCTION_CALL = 'FUNCTION_CALL',
}

export class Type {
  constructor(base = BaseType.INT) {
    this.base = base;
  }
  public base = BaseType.INT;
  toString(): string {
    return '' + this.base;
  }
}

export class Code {
  public str = '';
  constructor(str = '') {
    this.str = str;
  }
}

export class TypedCode {
  public type = new Type();
  public code = new Code();
  public sym: SymTabEntry = null;
}

export enum SymbolKind {
  Function = 'FUNCTION',
  Dimension = 'DIMENSION',
  Parameter = 'PARAMETER',
  Local = 'LOCAL',
}

export class SymTabEntry {
  public id = '';
  public kind = SymbolKind.Local;
  public type = new Type();
  public scope = 0;
  public runtimeId = '';
  public subSymbols: SymTabEntry[] = [];
  public functionOverloadSuccessor: SymTabEntry = null;
  public value: boolean | number | Matrix = null;

  constructor(
    id: string,
    kind: SymbolKind,
    type: Type,
    scope: number,
    subSymbols: SymTabEntry[] = [],
  ) {
    this.id = id;
    this.kind = kind;
    this.type = type;
    this.scope = scope;
    this.subSymbols = subSymbols;
  }

  toString(): string {
    let s = 'SYM';
    s += ',id="' + this.id + '"';
    s += ',kind="' + this.kind + '"';
    s += ',type="' + this.type.toString() + '"';
    s += ',scope="' + this.scope + '"';
    s += ',runtimeId="' + this.runtimeId + '"';
    if (this.subSymbols.length > 0) {
      s += ',subSymbols=[\n';
      for (let i = 0; i < this.subSymbols.length; i++) {
        s += '  ' + this.subSymbols[i].toString();
      }
      s += ']';
    }
    s += '\n';
    return s;
  }
}
