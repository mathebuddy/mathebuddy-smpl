/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as mathjs from 'mathjs';
import { RunError, SMPL_Interpreter } from './interpret';

import { Vector } from './vector';

export class SMPL_Interpreter_Vector {
  private parent: SMPL_Interpreter = null;

  constructor(parent: SMPL_Interpreter) {
    this.parent = parent;
  }

  _create(size: number, elements: number[]): Vector {
    const vec = new Vector(size);
    let k = 0;
    for (let i = 0; i < size; i++) {
      vec.setValue(i, elements[k++]);
    }
    return vec;
  }

  _getElement(x: Vector, idx: number, ERR_POS: string): number {
    if (idx < 0 || idx >= x.getSize())
      throw new RunError(
        ERR_POS,
        'vector has ' + x.getSize() + ' elements. Cannot get element ' + idx,
      );
    return x.getValue(idx);
  }

  _setElement(x: Vector, idx: number, value: number, ERR_POS: string): void {
    if (idx < 0 || idx >= x.getSize())
      throw new RunError(
        ERR_POS,
        'vector has ' + x.getSize() + ' element. Cannot get element ' + idx,
      );
    x.setValue(idx, value);
  }

  //G _add(x:VECTOR,y:VECTOR):VECTOR -> _addVectors;
  _addVectors(x: Vector, y: Vector, ERR_POS: string): Vector {
    if (x.getSize() != y.getSize())
      throw new RunError(ERR_POS, 'dimensions do not match');
    return Vector.add(x, y);
  }

  //G _sub(x:VECTOR,y:VECTOR):VECTOR -> _subVectors;
  _subVectors(x: Vector, y: Vector, ERR_POS: string): Vector {
    if (x.getSize() != y.getSize())
      throw new RunError(ERR_POS, 'dimensions do not match');
    return Vector.sub(x, y);
  }

  //G _mul(x:INT,y:VECTOR):VECTOR -> _mulScalarVector;
  //G _mul(x:REAL,y:VECTOR):VECTOR -> _mulScalarVector;
  _mulScalarVector(x: number, y: Vector): Vector {
    return y.mul(x);
  }

  //G dot(x:VECTOR, y:VECTOR): REAL -> _dotVectors;
  _dotVectors(x: Vector, y: Vector, ERR_POS: string): number {
    if (x.getSize() != y.getSize())
      throw new RunError(ERR_POS, 'dimensions do not match');
    return Vector.dot(x, y);
  }

  //G cross(x:VECTOR, y:VECTOR): VECTOR -> _crossVectors;
  _crossVectors(x: Vector, y: Vector, ERR_POS: string): Vector {
    if (x.getSize() != 3 || y.getSize() != 3)
      throw new RunError(ERR_POS, 'vector length must be 3');
    return Vector.cross(x, y);
  }

  //G norm2(x:VECTOR): REAL -> _norm2vec;
  _norm2vec(x: Vector): number {
    return x.norm2();
  }

  //G zeros<size:INT>(): VECTOR -> _zerosVector;
  _zerosVector(size: number): Vector {
    const v = new Vector(size);
    for (let i = 0; i < size; i++) {
      v.setValue(i, 0);
    }
    return v;
  }

  //G rand<size:INT>(min:INT, max:INT): VECTOR -> _randVector;
  _randVector(size: number, min: number, max: number): Vector {
    const v = new Vector(size);
    for (let i = 0; i < size; i++) {
      v.setValue(i, this.parent.interpret_basic._randIntMinMax(min, max));
    }
    return v;
  }

  //G randZ<size:INT>(min:INT, max:INT): VECTOR -> _randZVector;
  _randZVector(size: number, min: number, max: number): Vector {
    const v = new Vector(size);
    for (let i = 0; i < size; i++) {
      v.setValue(i, this.parent.interpret_basic._randIntMinMaxZ(min, max));
    }
    return v;
  }

  //G is_zero(x:VECTOR): BOOL -> _isVectorZero;
  _isVectorZero(x: Vector): boolean {
    return x.is_zero(1e-9); // TODO: configure epsilon
  }
}
