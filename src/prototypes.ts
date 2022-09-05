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
  _add(X:INT,y:REAL):REAL -> _add;
  _add(X:INT,y:REAL):REAL -> _add;
  _add(X:REAL,y:REAL):REAL -> _add;
  _add?(X:MATRIX,y:MATRIX):MATRIX -> _addMatrices;

  _sub(x:INT,y:INT):INT -> _add;
  _sub(X:INT,y:REAL):REAL -> _add;
  _sub(X:INT,y:REAL):REAL -> _add;
  _sub(X:REAL,y:REAL):REAL -> _add;

  _unaryMinus(x:INT):INT -> _unaryMinus;
  _unaryMinus(x:REAL):REAL -> _unaryMinus;

  _mul(x:INT,y:INT):INT -> _mul;
  _mul(X:INT,y:REAL):REAL -> _mul;
  _mul(X:INT,y:REAL):REAL -> _mul;
  _mul(X:REAL,y:REAL):REAL -> _mul;
  _mul?(X:MATRIX,y:MATRIX):MATRIX -> _mulMatrices;

  _div(x:INT,y:INT):REAL -> _mul;
  _div(X:INT,y:REAL):REAL -> _mul;
  _div(X:INT,y:REAL):REAL -> _mul;
  _div(X:REAL,y:REAL):REAL -> _mul;

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
`;
