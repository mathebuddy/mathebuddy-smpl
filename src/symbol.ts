/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Lexer } from '@multila/multila-lexer';
import { Complex } from './complex';
import { Figure2d } from './figure';

import { Matrix } from './matrix';
import { Set_COMPLEX, Set_INT, Set_REAL } from './set';
import { Term } from './term';
import { Vector } from './vector';

export enum BaseType {
  ID = 'ID',
  BOOL = 'BOOL',
  INT = 'INT',
  REAL = 'REAL',
  COMPLEX = 'COMPLEX',
  TERM = 'TERM',
  TERM_VAR = 'TERM_VAR',
  VECTOR = 'VECTOR',
  MATRIX = 'MATRIX',
  FUNCTION_CALL = 'FUNCTION_CALL',
  INT_SET = 'INT_SET',
  REAL_SET = 'REAL_SET',
  COMPLEX_SET = 'COMPLEX_SET',
  INT_LIST = 'INT_LIST',
  REAL_LIST = 'REAL_LIST',
  COMPLEX_LIST = 'COMPLEX_LIST',
  VECTOR_LIST = 'VECTOR_LIST',
  STRING = 'STRING',
  FIGURE_2D = 'FIGURE_2D',
  VOID = 'VOID',
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
  public tmp = '';
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
  //public runtimeExceptions = false;
  public subSymbols: SymTabEntry[] = [];
  public functionOverloadSuccessor: SymTabEntry = null;
  public value:
    | string
    | boolean
    | number
    | Complex
    | Set_INT
    | Set_REAL
    | Set_COMPLEX
    | Term
    | Vector
    | Matrix
    | Figure2d = null;

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
  if (str === 'VOID') return BaseType.VOID;
  else if (str === 'ID') return BaseType.ID;
  else if (str === 'BOOL') return BaseType.BOOL;
  else if (str === 'INT') return BaseType.INT;
  else if (str === 'REAL') return BaseType.REAL;
  else if (str === 'COMPLEX') return BaseType.COMPLEX;
  else if (str === 'VECTOR') return BaseType.VECTOR;
  else if (str === 'MATRIX') return BaseType.MATRIX;
  else if (str === 'TERM') return BaseType.TERM;
  else if (str === 'TERM_VAR') return BaseType.TERM_VAR;
  else if (str === 'SET_INT') return BaseType.INT_SET;
  else if (str === 'SET_REAL') return BaseType.REAL_SET;
  else if (str === 'SET_COMPLEX') return BaseType.COMPLEX_SET;
  else if (str === 'INT_LIST') return BaseType.INT_LIST;
  else if (str === 'REAL_LIST') return BaseType.REAL_LIST;
  else if (str === 'COMPLEX_LIST') return BaseType.COMPLEX_LIST;
  else if (str === 'VECTOR_LIST') return BaseType.VECTOR_LIST;
  else if (str === 'FIGURE_2D') return BaseType.FIGURE_2D;
  else if (str === 'STRING') return BaseType.STRING;
  else lex.error('unknown base type ' + str);
}

//G prototype = ID [ "<" params ">" ] "(" [ params ] ")" ":" type "->" ID "." ID ";";
//G params = "ID" ":" type { "," "ID" ":" type };
//G type = "INT" | "REAL" | "COMPLEX" | "VECTOR" | "MATRIX";
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
    /*let runtimeExceptions = false;
    if (lex.isTER('?')) {
      lex.next();
      runtimeExceptions = true;
    }*/
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
    let runtimeID = lex.ID();
    lex.TER('.');
    runtimeID += '.' + lex.ID();
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
    //s.runtimeExceptions = runtimeExceptions;
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
