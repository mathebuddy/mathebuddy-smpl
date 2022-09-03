/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

/**
 * This file populates the symbol table with function prototypes.
 * Each function must be implemented in file codeRun.ts.
 */

import { Lexer } from '@multila/multila-lexer';

import { BaseType, SymbolKind, SymTabEntry, Type } from './symbol';

// TODO: write documentation for each function + extract it

//G prototype = ID [ "<" params ">" ] "(" [ params ] ")" ":" type "->" ID ";";
//G params = "ID" ":" type { "," "ID" ":" type };
//G type = "INT" | "REAL" | "COMPLEX" | "MATRIX";
const functions = `
  abs(x:INT):INT -> _absInt;
  abs(x:REAL):REAL -> _absReal;
  abs(x:COMPLEX): REAL -> _absComplex;
  # calculates the absolute value
  exp(x:INT):REAL -> _exp;
  exp(x:REAL):REAL -> _exp;
  exp(x:COMPLEX):COMPLEX -> _expComplex;
  sqrt(x:REAL): REAL -> _sqrt;
  sqrt(x:COMPLEX): COMPLEX -> _sqrtComplex;
  sin(x:INT): REAL -> _sin;
  sin(x:REAL): REAL -> _sin;
  cos(x:INT): REAL -> _cos;
  cos(x:REAL): REAL -> _cos;
  tan(x:INT): REAL -> _tan;
  tan(x:REAL): REAL -> _tan;
  asin(x:INT): REAL -> _asin;
  asin(x:REAL): REAL -> _asin;
  acos(x:INT): REAL -> _acos;
  acos(x:REAL): REAL -> _acos;
  atan(x:INT): REAL -> _atan;
  atan(x:REAL): REAL -> _atan;
  floor(x:INT): INT -> _floor;
  floor(x:REAL): INT -> _floor;
  ceil(x:INT): INT -> _ceil;
  ceil(x:REAL): INT -> _ceil;
  round(x:INT): INT -> _round;
  round(x:REAL): INT -> _round;
  sign(x:INT): INT -> _sign;
  sign(x:REAL): INT -> _sign;
  rand(max:INT): INT -> _randIntMax;
  rand(min:INT,max:INT): INT -> _randIntMinMax;
  randZ(max:INT): INT -> _randZIntMax;
  randZ(min:INT,max:INT): INT -> _randZIntMinMax;
  rand<rows:INT,columns:INT>(min:INT,max:INT): MATRIX -> _randMatrix;
  randZ<rows:INT,columns:INT>(min:INT,max:INT): MATRIX -> _randZMatrix;
  binomial(n:INT,k:INT): INT -> _binomial;
  min(x:MATRIX): REAL -> _minMatrix;
  max(x:MATRIX): REAL -> _maxMatrix;
`;

function getBaseType(lex: Lexer, str: string): BaseType {
  if (str === 'BOOL') return BaseType.BOOL;
  else if (str === 'INT') return BaseType.INT;
  else if (str === 'REAL') return BaseType.REAL;
  else if (str === 'COMPLEX') return BaseType.COMPLEX;
  else if (str === 'MATRIX') return BaseType.MATRIX;
  else lex.error('unknown base type ' + str);
}

export function createFunctionPrototypes(): SymTabEntry[] {
  // set up lexer
  const lex = new Lexer();
  lex.configureSingleLineComments('#');
  lex.configureMultiLineComments('', '');
  lex.enableEmitNewlines(false);
  lex.enableEmitIndentation(false);
  lex.enableBackslashLineBreaks(false);
  lex.setTerminals(['->']);
  lex.pushSource('INTERNAL', functions);
  // parse
  const symTab: SymTabEntry[] = [];
  while (lex.isNotEND()) {
    // (a) read properties
    const funID = lex.ID();
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
        SymbolKind.Parameter,
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
