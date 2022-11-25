/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

//import * as mathjs from 'mathjs';

export class VectorError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'VectorError';
  }
}

export class Vector {
  private size = 1;
  private values: number[] = [];

  constructor(size: number) {
    this.size = size;
    this.values = new Array(size).fill(0);
  }

  getSize(): number {
    return this.size;
  }

  setValue(pos: number, v: number): void {
    this.values[pos] = v;
  }

  getValue(pos: number): number {
    return this.values[pos];
  }

  static vector2list(v: Vector): number[] {
    return v.clone().values;
  }

  clone(): Vector {
    const v = new Vector(this.size);
    v.values = [...this.values];
    return v;
  }

  toString(): string {
    let s = '[';
    for (let i = 0; i < this.size; i++) {
      if (i > 0) s += ',';
      s += this.getValue(i);
    }
    s += ']';
    return s;
  }

  static add(x: Vector, y: Vector): Vector {
    if (x.size != y.size) throw new VectorError('dimensions do not match');
    const z = x.clone();
    for (let i = 0; i < y.size; i++) {
      z.values[i] += y.values[i];
    }
    return z;
  }

  static sub(x: Vector, y: Vector): Vector {
    if (x.size != y.size) throw new VectorError('dimensions do not match');
    const z = x.clone();
    for (let i = 0; i < y.size; i++) {
      z.values[i] -= y.values[i];
    }
    return z;
  }

  mul(v: number): Vector {
    const z = this.clone();
    for (let i = 0; i < z.size; i++) {
      z.values[i] *= v;
    }
    return z;
  }

  static dot(x: Vector, y: Vector): number {
    if (x.size != y.size) throw new VectorError('dimensions do not match');
    let z = 0;
    for (let i = 0; i < y.size; i++) {
      z += x.values[i] * y.values[i];
    }
    return z;
  }

  static cross(x: Vector, y: Vector): Vector {
    if (x.size != 3 || y.size != 3)
      throw new VectorError('vector length must be 3');
    const z = new Vector(3);
    z.values[0] = x.values[1] * y.values[2] - x.values[2] * y.values[1];
    z.values[1] = x.values[2] * y.values[0] - x.values[0] * y.values[2];
    z.values[2] = x.values[0] * y.values[1] - x.values[1] * y.values[0];
    return z;
  }

  norm2(): number {
    let r = 0;
    for (let i = 0; i < this.size; i++) {
      r += this.values[i] * this.values[i];
    }
    return Math.sqrt(r);
  }

  is_zero(epsilon = 1e-9): boolean {
    for (let i = 0; i < this.size; i++) {
      if (Math.abs(this.getValue(i)) > epsilon) {
        return false;
      }
    }
    return true;
  }
}
