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

// TODO: write documentation for each function + extract it

//G prototype = ID [ "?" ] [ "<" params ">" ] "(" [ params ] ")" ":" type "->" ID ";";
//G params = "ID" ":" type { "," "ID" ":" type };
//G type = "INT" | "REAL" | "COMPLEX" | "MATRIX";

export const functionPrototypes = `

  _add(x:INT,y:INT):INT -> _add;
  _add(x:INT,y:REAL):REAL -> _add;
  _add(x:REAL,y:INT):REAL -> _add;
  _add(x:REAL,y:REAL):REAL -> _add;
  _add(x:COMPLEX,y:COMPLEX):COMPLEX -> _addComplex;
  _add?(x:MATRIX,y:MATRIX):MATRIX -> _addMatrices;

  _sub(x:INT,y:INT):INT -> _sub;
  _sub(X:INT,y:REAL):REAL -> _sub;
  _sub(x:REAL,y:INT):REAL -> _sub;
  _sub(x:REAL,y:REAL):REAL -> _sub;
  _sub(x:COMPLEX,y:COMPLEX):COMPLEX -> _subComplex;
  _sub?(x:MATRIX,y:MATRIX):MATRIX -> _subMatrices;

  _unaryMinus(x:INT):INT -> _unaryMinus;
  _unaryMinus(x:REAL):REAL -> _unaryMinus;

  _unaryNot(x:BOOL):BOOL -> _unaryNot;

  _mul(x:INT,y:INT):INT -> _mul;
  _mul(x:INT,y:REAL):REAL -> _mul;
  _mul(x:REAL,y:INT):REAL -> _mul;
  _mul(x:REAL,y:REAL):REAL -> _mul;
  _mul?(x:MATRIX,y:MATRIX):MATRIX -> _mulMatrices;

  _div(x:INT,y:INT):REAL -> _div;
  _div(x:INT,y:REAL):REAL -> _div;
  _div(x:REAL,y:INT):REAL -> _div;
  _div(x:REAL,y:REAL):REAL -> _div;

  _pow(x:INT,y:INT):INT -> _pow;
  _pow(x:INT,y:REAL):REAL -> _pow;
  _pow(x:REAL,y:INT):REAL -> _pow;
  _pow(x:REAL,y:REAL):REAL -> _pow;

  _pow(x:TERM_VAR,y:INT):TERM -> _powTermVarReal;
  _pow(x:TERM_VAR,y:REAL):TERM -> _powTermVarReal;

  rand(max:INT): INT -> _randIntMax;
  rand(min:INT,max:INT): INT -> _randIntMinMax;
  randZ(max:INT): INT -> _randZIntMax;
  randZ(min:INT,max:INT): INT -> _randZIntMinMax;
  rand<rows:INT,columns:INT>(min:INT,max:INT): MATRIX -> _randMatrix;
  randZ<rows:INT,columns:INT>(min:INT,max:INT): MATRIX -> _randZMatrix;

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

  binomial(n:INT,k:INT): INT -> _binomial;
  min(x:MATRIX): REAL -> _minMatrix;
  max(x:MATRIX): REAL -> _maxMatrix;
  det?(x:MATRIX): REAL -> _det;
`;
