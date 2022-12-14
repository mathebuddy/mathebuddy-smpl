/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { RunError, SMPL_Interpreter } from './interpret';

import { Matrix } from './matrix';
import { Term, TermError } from './term';

export class SMPL_Interpreter_Term {
  private parent: SMPL_Interpreter = null;

  constructor(parent: SMPL_Interpreter) {
    this.parent = parent;
  }

  var(id: string): Term {
    return Term.Var(id);
  }

  // this method has no grammar, since it is called manually
  _eval(
    t: Term,
    varValues: { [varId: string]: number },
    ERR_POS: string,
  ): number {
    let res = 0;
    try {
      res = t.eval(varValues);
    } catch (e) {
      throw new RunError(ERR_POS, (e as TermError).message);
    }
    return res;
  }

  //G _numberToTerm(x:INT):TERM -> _numberToTerm;
  _numberToTerm(x: number): Term {
    return Term.Const(x);
  }

  //G _add(x:TERM,y:INT):TERM -> _addTermReal;
  //G _add(x:TERM,y:REAL):TERM -> _addTermReal;
  _addTermReal(x: Term, y: number): Term {
    return Term.Op('+', [x, Term.Const(y)]);
  }

  //G _add(x:INT,y:TERM):TERM -> _addRealTerm;
  //G _add(x:REAL,y:TERM):TERM -> _addRealTerm;
  _addRealTerm(x: number, y: Term): Term {
    return Term.Op('+', [Term.Const(x), y]);
  }

  //G _add(x:TERM,y:TERM):TERM -> _addTermTerm;
  _addTermTerm(x: Term, y: Term): Term {
    return Term.Op('+', [x, y]);
  }

  //G _sub(x:TERM,y:INT):TERM -> _subTermReal;
  //G _sub(x:TERM,y:REAL):TERM -> _subTermReal;
  _subTermReal(x: Term, y: number): Term {
    return Term.Op('-', [x, Term.Const(y)]);
  }

  //G _sub(x:INT,y:TERM):TERM -> _subRealTerm;
  //G _sub(x:REAL,y:TERM):TERM -> _subRealTerm;
  _subRealTerm(x: number, y: Term): Term {
    return Term.Op('-', [Term.Const(x), y]);
  }

  //G _sub(x:TERM,y:TERM):TERM -> _subTermTerm;
  _subTermTerm(x: Term, y: Term): Term {
    return Term.Op('-', [x, y]);
  }

  //G _mul(x:TERM,y:INT):TERM -> _mulTermReal;
  //G _mul(x:TERM,y:REAL):TERM -> _mulTermReal;
  _mulTermReal(x: Term, y: number): Term {
    return Term.Op('*', [x, Term.Const(y)]);
  }

  //G _mul(x:INT,y:TERM):TERM -> _mulRealTerm;
  //G _mul(x:REAL,y:TERM):TERM -> _mulRealTerm;
  _mulRealTerm(x: number, y: Term): Term {
    return Term.Op('*', [Term.Const(x), y]);
  }

  //G _mul(x:TERM,y:TERM):TERM -> _mulTermTerm;
  _mulTermTerm(x: Term, y: Term): Term {
    return Term.Op('*', [x, y]);
  }

  //G _div(x:TERM,y:INT):TERM -> _divTermReal;
  //G _div(x:TERM,y:REAL):TERM -> _divTermReal;
  _divTermReal(x: Term, y: number): Term {
    return Term.Op('/', [x, Term.Const(y)]);
  }

  //G _div(x:INT,y:TERM):TERM -> _divRealTerm;
  //G _div(x:REAL,y:TERM):TERM -> _divRealTerm;
  _divRealTerm(x: number, y: Term): Term {
    return Term.Op('/', [Term.Const(x), y]);
  }

  //G _div(x:TERM,y:TERM):TERM -> _divTermTerm;
  _divTermTerm(x: Term, y: Term): Term {
    return Term.Op('/', [x, y]);
  }

  //G _unaryMinus(x:TERM):TERM -> _unaryMinusTerm;
  _unaryMinusTerm(t: Term): Term {
    return Term.Op('.-', [t]);
  }

  //G _pow(x:TERM,y:INT):TERM -> _powTermReal;
  //G _pow(x:TERM,y:REAL):TERM -> _powTermReal;
  _powTermReal(x: Term, y: number): Term {
    return Term.Op('^', [x, Term.Const(y)]);
  }

  //G _pow(x:INT,y:TERM):TERM -> _powRealTerm;
  //G _pow(x:REAL,y:TERM):TERM -> _powRealTerm;
  _powRealTerm(x: number, y: Term): Term {
    return Term.Op('^', [Term.Const(x), y]);
  }

  //G _pow(x:TERM,y:TERM):TERM -> _powTermTerm;
  _powTermTerm(x: Term, y: Term): Term {
    return Term.Op('^', [x, y]);
  }

  //G sin(x:TERM): TERM -> _sinTerm;
  _sinTerm(x: Term): Term {
    return Term.Op('sin', [x]);
  }

  //G cos(x:TERM): TERM -> _cosTerm;
  _cosTerm(x: Term): Term {
    return Term.Op('cos', [x]);
  }

  //G tan(x:TERM): TERM -> _tanTerm;
  _tanTerm(x: Term): Term {
    return Term.Op('tan', [x]);
  }

  //G exp(x:TERM): TERM -> _expTerm;
  _expTerm(x: Term): Term {
    return Term.Op('exp', [x]);
  }

  //G diff(x:TERM, varId:TERM): TERM -> _diffTerm;
  _diffTerm(x: Term, varId: Term): Term {
    // TODO: must check, if varId is a valid term!!
    const d = x.diff(varId.toString());
    return d;
  }

  //G ode(lhs:TERM,rhs:TERM): TERM -> _ode;
  _ode(lhs: Term, rhs: Term): Term {
    return Term.Op('ode', [lhs, rhs]);
  }
}
