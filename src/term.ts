/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

export class TermError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'TermError';
  }
}

/**
 * Algebraic term.
 */
export class Term {
  private op = ''; // operation. Special operations: '$' := variable, '#' := scalar
  private value: string | number = ''; // variable id or scalar number
  private o: Term[] = []; // operands = sub-terms

  constructor(op = '', o: Term[] = []) {
    this.op = op;
    this.o = o;
  }

  /**
   * Creates a term with operation op and operands o
   * @param op operation, e.g. '+'
   * @param o operands
   * @returns a new term
   */
  public static Op(op: string, o: Term[]): Term {
    const t = new Term();
    t.op = op;
    t.o = o;
    return t;
  }

  /**
   * Creates a constant term (scalar)
   * @param value constant value
   * @returns a new term
   */
  public static Const(value: number): Term {
    const t = new Term();
    t.op = '#';
    t.value = value;
    return t;
  }

  /**
   * Creates a variable term
   * @param id variable identifier
   * @returns
   */
  public static Var(id: string): Term {
    const t = new Term();
    t.op = '$';
    t.value = id;
    return t;
  }

  /**
   * Creates an exact copy of this
   * @returns clone
   */
  public clone(): Term {
    const c = new Term();
    c.op = this.op;
    c.value = this.value;
    for (const oi of this.o) {
      c.o.push(oi.clone());
    }
    return c;
  }

  /**
   * Evaluates the term or throws an exception, if any variable has an unknown
   * value
   * @param varValues dictionary that substitutes variables by constants, e.g. {x:5,y:7}
   * @returns the numeric evaluated result
   */
  eval(varValues: { [varId: string]: number } = {}): number {
    let x;
    switch (this.op) {
      case '+':
        x = 0;
        for (const oi of this.o) x += oi.eval(varValues);
        break;
      case '*':
        x = 1;
        for (const oi of this.o) x *= oi.eval(varValues);
        break;
      case '-':
        x = 0;
        for (const oi of this.o) x -= oi.eval(varValues);
        break;
      case '#':
        x = this.value as number;
        break;
      case 'sin':
        x = Math.sin(this.o[0].eval(varValues));
        break;
      case 'cos':
        x = Math.cos(this.o[0].eval(varValues));
        break;
      case 'tan':
        x = Math.tan(this.o[0].eval(varValues));
        break;
      case 'asin':
        x = Math.asin(this.o[0].eval(varValues));
        break;
      case 'atan':
        x = Math.atan(this.o[0].eval(varValues));
        break;
      case 'exp':
        x = Math.exp(this.o[0].eval(varValues));
        break;
      case '$':
        if ((this.value as string) in varValues)
          return varValues[this.value as string];
        else
          throw new TermError('eval(..): unset variable "' + this.value + '"');
      default:
        throw new TermError(
          'eval(..): unimplemented operator "' + this.op + '"',
        );
    }
    return x;
  }

  /**
   * Symbolic differentiation. The resulting term is not optimized.
   * The caller should also call "opt()" after "diff(..)".
   * @param varId derivation variable
   * @returns symbolic derivated term
   */
  diff(varId: string): Term {
    let t: Term = null;
    switch (this.op) {
      case '+':
        // diff(n0+n1+...) = diff(n0) + diff(n1) + ...
        t = Term.Op('+', []);
        for (const oi of this.o) t.o.push(oi.diff(varId));
        break;
      case '*': // TODO: non-binary!
        // diff(n0*n1) = diff(n0)*n1 + n0*diff(n1)
        t = Term.Op('+', [
          Term.Op('*', [this.o[0].diff(varId), this.o[1].clone()]),
          Term.Op('*', [this.o[0].clone(), this.o[1].diff(varId)]),
        ]);
        break;
      case '$':
        t = Term.Const(this.value === varId ? 1 : 0);
        break;
      case '#':
        t = Term.Const(0);
        break;
      default:
        throw new TermError(
          'diff(..): unimplemented operator "' + this.op + '"',
        );
    }
    return t;
  }

  /**
   * Integrates a definite integral numerically
   * @param varId variable identifier
   * @param a lower bound
   * @param b upper bound
   * @param h step width
   * @returns approximated integral
   */
  integrate(varId: string, a: number, b: number, h = 1e-12): number {
    // TODO: trapezoidal rule!
    let r = 0;
    for (let x = a; x <= b; x += h) {
      r += this.eval({ varId: x });
    }
    return r / h;
  }

  /**
   * Returns an optimized representation of the term that is algebraically
   * equivalent (e.g. "x+2+3*4+5*x" -> "14+6*x").
   * @returns optimized representation of the term
   */
  optimize(): Term {
    // TODO: reorder operands
    // return only cloned versions of term
    const t = this.clone();
    // run recursively
    for (let i = 0; i < t.o.length; i++) {
      t.o[i] = t.o[i].optimize();
    }
    // algebraic simplifications
    if (this.op === '*') {
      // n0 * n1 * ... is 0, if any oi is 0
      for (const oi of t.o) {
        if (oi.op === '#' && oi.value == 0) {
          return Term.Const(0);
        }
      }
    }
    // try to evaluate term
    try {
      const v = t.eval();
      // result is constant, if all operands are constant
      return Term.Const(v);
    } catch (e) {
      // if t contains variables, an error is thrown.
      // In this case, the evaluation result is dismissed.
    }
    // return result
    return t;
  }

  setVariableValue(id: string, value: number): void {
    if (this.op === '$') {
      this.op = '#';
      this.value = value;
    }
    for (const oi of this.o) {
      oi.setVariableValue(id, value);
    }
  }

  /**
   * Returns the set of variable IDs that are actually used in the term.
   * @returns variable IDs a string
   */
  getVariableIDs(): Set<string> {
    let vars = new Set<string>();
    if (this.op === '$') vars.add(this.value as string);
    for (const oi of this.o) {
      vars = new Set([...vars, ...oi.getVariableIDs()]);
    }
    return vars;
  }

  /**
   * Converts the term object to a string.
   * @returns stringified representation of term
   */
  toString(): string {
    let s = '';
    switch (this.op) {
      case '#':
      case '$':
        s = '' + this.value;
        break;
      default:
        if (this.op.length > 2) {
          // sin, cos, exp, ...
          s += this.op + '(';
          for (let i = 0; i < this.o.length; i++) {
            if (i > 0) s += ',';
            s += this.o[i].toString();
          }
          s += ')';
        } else {
          // '+', '-', ...
          for (let i = 0; i < this.o.length; i++) {
            if (i > 0) s += this.op;
            s += this.o[i].toString();
          }
        }
        break;
    }
    return s;
  }
}
