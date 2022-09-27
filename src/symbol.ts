/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Lexer } from '@multila/multila-lexer';

import { Matrix } from './matrix';
import { Term } from './term';

export enum BaseType {
  BOOL = 'BOOL',
  INT = 'INT',
  REAL = 'REAL',
  IMAG = 'IMAG',
  COMPLEX = 'COMPLEX',
  TERM = 'TERM',
  TERM_VAR = 'TERM_VAR',
  MATRIX = 'MATRIX',
  FUNCTION_CALL = 'FUNCTION_CALL',
}

export class Type {
  constructor(base = BaseType.INT) {
    this.base = base;
  }
  clone(): Type {
    const t = new Type();
    t.base = this.base;
    return t;
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
  public runtimeExceptions = false;
  public subSymbols: SymTabEntry[] = [];
  public functionOverloadSuccessor: SymTabEntry = null;
  public value: boolean | number | Term | Matrix = null;

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

function getBaseType(lex: Lexer, str: string): BaseType {
  if (str === 'BOOL') return BaseType.BOOL;
  else if (str === 'INT') return BaseType.INT;
  else if (str === 'REAL') return BaseType.REAL;
  else if (str === 'COMPLEX') return BaseType.COMPLEX;
  else if (str === 'MATRIX') return BaseType.MATRIX;
  else if (str === 'TERM') return BaseType.TERM;
  else if (str === 'TERM_VAR') return BaseType.TERM_VAR;
  else lex.error('unknown base type ' + str);
}

export function createFunctionPrototypes(prototypeDef: string): SymTabEntry[] {
  // set up lexer
  const lex = new Lexer();
  lex.configureSingleLineComments('#');
  lex.configureMultiLineComments('', '');
  lex.enableEmitNewlines(false);
  lex.enableEmitIndentation(false);
  lex.enableBackslashLineBreaks(false);
  lex.setTerminals(['->']);
  lex.pushSource('PROTOTYPES', prototypeDef);
  // parse
  const symTab: SymTabEntry[] = [];
  while (lex.isNotEND()) {
    // (a) read properties
    const funID = lex.ID();
    let runtimeExceptions = false;
    if (lex.isTER('?')) {
      lex.next();
      runtimeExceptions = true;
    }
    const dimIDs: string[] = [];
    const dimTypes: BaseType[] = [];
    if (lex.isTER('<')) {
      lex.next();
      let i = 0;
      while (lex.isNotTER('>')) {
        if (i > 0) lex.TER(',');
        dimIDs.push(lex.ID());
        lex.TER(':');
        dimTypes.push(getBaseType(lex, lex.ID()));
        i++;
      }
      lex.TER('>');
    }
    const paramIDs: string[] = [];
    const paramTypes: BaseType[] = [];
    lex.TER('(');
    let i = 0;
    while (lex.isNotTER(')')) {
      if (i > 0) lex.TER(',');
      paramIDs.push(lex.ID());
      lex.TER(':');
      paramTypes.push(getBaseType(lex, lex.ID()));
      i++;
    }
    lex.TER(')');
    lex.TER(':');
    const returnType = getBaseType(lex, lex.ID());
    lex.TER('->');
    const runtimeID = lex.ID();
    lex.TER(';');
    // (b) populate symbol table
    const subSymbols: SymTabEntry[] = [];
    for (let i = 0; i < dimIDs.length; i++) {
      const dim = new SymTabEntry(
        dimIDs[i],
        SymbolKind.Dimension,
        new Type(dimTypes[i]),
        1,
        [],
      );
      subSymbols.push(dim);
    }
    for (let i = 0; i < paramIDs.length; i++) {
      const param = new SymTabEntry(
        paramIDs[i],
        SymbolKind.Parameter,
        new Type(paramTypes[i]),
        1,
        [],
      );
      subSymbols.push(param);
    }
    const s = new SymTabEntry(
      funID,
      SymbolKind.Function,
      new Type(returnType),
      0,
      subSymbols,
    );
    s.runtimeId = runtimeID;
    s.runtimeExceptions = runtimeExceptions;
    // function overloading?
    for (let i = symTab.length - 1; i >= 0; i--) {
      // TODO: this is slow: use a dictionary with ref to last entry for every id
      if (symTab[i].id === funID) {
        symTab[i].functionOverloadSuccessor = s;
        break;
      }
    }
    // finally push symbol to symbol table
    symTab.push(s);
  }

  //for (const sym of symTab) console.log(sym.toString());

  // return result
  return symTab;
}
