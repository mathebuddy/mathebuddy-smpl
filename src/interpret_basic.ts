/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as mathjs from 'mathjs';

import { RunError, SMPL_Interpreter } from './interpret';

export class SMPL_Interpreter_Basic {
  private parent: SMPL_Interpreter = null;

  constructor(parent: SMPL_Interpreter) {
    this.parent = parent;
  }

  //G _equal(x:BOOL,y:BOOL):BOOL -> _equalBooleans;
  _equalBooleans(x: boolean, y: boolean): boolean {
    return x == y;
  }

  //G _equal(x:INT,y:INT):BOOL -> _equalNumbers;
  //G _equal(x:INT,y:REAL):BOOL -> _equalNumbers;
  //G _equal(x:REAL,y:INT):BOOL -> _equalNumbers;
  //G _equal(x:REAL,y:REAL):BOOL -> _equalNumbers;
  _equalNumbers(x: number, y: number): boolean {
    const epsilon = 1e-9; // TODO: make configurable
    return Math.abs(x - y) <= epsilon;
  }

  //G _unequal(x:BOOL,y:BOOL):BOOL -> _unequalBooleans;
  _unequalBooleans(x: boolean, y: boolean): boolean {
    return x != y;
  }

  //G _unequal(x:INT,y:INT):BOOL -> _unequalNumbers;
  //G _unequal(x:INT,y:REAL):BOOL -> _unequalNumbers;
  //G _unequal(x:REAL,y:INT):BOOL -> _unequalNumbers;
  //G _unequal(x:REAL,y:REAL):BOOL -> _unequalNumbers;
  _unequalNumbers(x: number, y: number): boolean {
    const epsilon = 1e-9; // TODO: make configurable
    return Math.abs(x - y) > epsilon;
  }

  //G _add(x:INT,y:INT):INT -> _add;
  //G _add(x:INT,y:REAL):REAL -> _add;
  //G _add(x:REAL,y:INT):REAL -> _add;
  //G _add(x:REAL,y:REAL):REAL -> _add;
  _add(x: number, y: number): number {
    return x + y;
  }

  //G _unaryMinus(x:INT):INT -> _unaryMinus;
  //G _unaryMinus(x:REAL):REAL -> _unaryMinus;
  _unaryMinus(x: number): number {
    return -x;
  }

  //G _unaryNot(x:BOOL):BOOL -> _unaryNot;
  _unaryNot(x: boolean): boolean {
    return !x;
  }

  //G _sub(x:INT,y:INT):INT -> _sub;
  //G _sub(X:INT,y:REAL):REAL -> _sub;
  //G _sub(x:REAL,y:INT):REAL -> _sub;
  //G _sub(x:REAL,y:REAL):REAL -> _sub;
  _sub(x: number, y: number): number {
    return x - y;
  }

  //G _mul(x:INT,y:INT):INT -> _mul;
  //G _mul(x:INT,y:REAL):REAL -> _mul;
  //G _mul(x:REAL,y:INT):REAL -> _mul;
  //G _mul(x:REAL,y:REAL):REAL -> _mul;
  _mul(x: number, y: number): number {
    return x * y;
  }

  //G _div(x:INT,y:INT):REAL -> _div;
  //G _div(x:INT,y:REAL):REAL -> _div;
  //G _div(x:REAL,y:INT):REAL -> _div;
  //G _div(x:REAL,y:REAL):REAL -> _div;
  _div(x: number, y: number): number {
    return x / y;
  }

  //G _mod(x:INT,y:INT):INT -> _mod;
  _mod(x: number, y: number): number {
    return x % y;
  }

  //G _pow(x:INT,y:INT):INT -> _pow;
  //G _pow(x:INT,y:REAL):REAL -> _pow;
  //G _pow(x:REAL,y:INT):REAL -> _pow;
  //G _pow(x:REAL,y:REAL):REAL -> _pow;
  _pow(x: number, y: number): number {
    return Math.pow(x, y);
  }

  //G rand(max:INT): INT -> _randIntMax;
  _randIntMax(max: number): number {
    return Math.floor(Math.random() * max);
  }

  //randZ(max:INT): INT -> _randIntMaxZ;
  _randIntMaxZ(max: number): number {
    let r = 0;
    while (r == 0) r = this._randIntMax(max);
    return r;
  }

  //G rand(min:INT,max:INT): INT -> _randIntMinMax;
  _randIntMinMax(min: number, max: number): number {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  }

  //G randZ(min:INT,max:INT): INT -> _randIntMinMaxZ;
  _randIntMinMaxZ(min: number, max: number): number {
    let r = 0;
    while (r == 0) r = this._randIntMinMax(min, max);
    return r;
  }

  //G sin(x:INT): REAL -> _sin;
  //G sin(x:REAL): REAL -> _sin;
  _sin(x: number): number {
    return Math.sin(x);
  }

  //G cos(x:INT): REAL -> _cos;
  //G cos(x:REAL): REAL -> _cos;
  _cos(x: number): number {
    return Math.cos(x);
  }

  //G tan(x:INT): REAL -> _tan;
  //G tan(x:REAL): REAL -> _tan;
  _tan(x: number): number {
    return Math.tan(x);
  }

  //G asin(x:INT): REAL -> _asin;
  //G asin(x:REAL): REAL -> _asin;
  _asin(x: number): number {
    return Math.asin(x);
  }

  //G acos(x:INT): REAL -> _acos;
  //G acos(x:REAL): REAL -> _acos;
  _acos(x: number): number {
    return Math.acos(x);
  }

  //G atan(x:INT): REAL -> _atan;
  //G atan(x:REAL): REAL -> _atan;
  _atan(x: number): number {
    return Math.atan(x);
  }

  //G exp(x:INT):REAL -> _exp;
  //G exp(x:REAL):REAL -> _exp;
  _exp(x: number): number {
    return Math.exp(x);
  }

  //G sqrt(x:INT): REAL -> _sqrt;
  //G sqrt(x:REAL): REAL -> _sqrt;
  _sqrt(x: number, ERR_POS: string): number {
    if (x < 0)
      throw new RunError(
        ERR_POS,
        'parameter must be positive; otherwise use function "sqrtC"',
      );
    return Math.sqrt(x);
  }

  //G abs(x:INT):INT -> _abs;
  //G abs(x:REAL):REAL -> _abs;
  _abs(x: number): number {
    return Math.abs(x);
  }

  //G floor(x:INT): INT -> _floor;
  //G floor(x:REAL): INT -> _floor;
  //G int(x:INT): INT -> _floor;
  //G int(x:REAL): INT -> _floor;
  _floor(x: number): number {
    return Math.floor(x);
  }

  //G ceil(x:INT): INT -> _ceil;
  //G ceil(x:REAL): INT -> _ceil;
  _ceil(x: number): number {
    return Math.ceil(x);
  }

  //G round(x:INT): INT -> _round;
  //G round(x:REAL): INT -> _round;
  _round(x: number): number {
    return Math.round(x);
  }

  //G sign(x:INT): INT -> _sign;
  //G sign(x:REAL): INT -> _sign;
  _sign(x: number): number {
    return x == 0 ? 0 : x < 0 ? -1 : 1;
  }

  //G max(list:INT_LIST): INT -> _maxInt;
  _maxInt(list: number[]): number {
    return Math.max(...list);
  }

  //G fac(x:INT): INT -> _fac;
  _fac(x: number): number {
    let y = 1;
    for (let i = 1; i <= x; i++) {
      y *= i;
    }
    return y;
  }

  //G binomial(n:INT,k:INT): INT -> _binomial;
  _binomial(n: number, k: number): number {
    return mathjs.combinations(n, k);
  }
}
