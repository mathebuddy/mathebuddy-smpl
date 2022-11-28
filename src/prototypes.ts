/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

/**
 * THIS FILE IS GENERATED AUTOMATICALLY BY RUNNING "python3 gen_prototypes.py > prototypes.ts"
 */

export const functionPrototypes = `

_add(x:INT,y:INT):INT -> interpret_basic._add;
_add(x:INT,y:REAL):REAL -> interpret_basic._add;
_add(x:REAL,y:INT):REAL -> interpret_basic._add;
_add(x:REAL,y:REAL):REAL -> interpret_basic._add;
_unaryMinus(x:INT):INT -> interpret_basic._unaryMinus;
_unaryMinus(x:REAL):REAL -> interpret_basic._unaryMinus;
_unaryNot(x:BOOL):BOOL -> interpret_basic._unaryNot;
_sub(x:INT,y:INT):INT -> interpret_basic._sub;
_sub(X:INT,y:REAL):REAL -> interpret_basic._sub;
_sub(x:REAL,y:INT):REAL -> interpret_basic._sub;
_sub(x:REAL,y:REAL):REAL -> interpret_basic._sub;
_mul(x:INT,y:INT):INT -> interpret_basic._mul;
_mul(x:INT,y:REAL):REAL -> interpret_basic._mul;
_mul(x:REAL,y:INT):REAL -> interpret_basic._mul;
_mul(x:REAL,y:REAL):REAL -> interpret_basic._mul;
_div(x:INT,y:INT):REAL -> interpret_basic._div;
_div(x:INT,y:REAL):REAL -> interpret_basic._div;
_div(x:REAL,y:INT):REAL -> interpret_basic._div;
_div(x:REAL,y:REAL):REAL -> interpret_basic._div;
_mod(x:INT,y:INT):INT -> interpret_basic._mod;
_pow(x:INT,y:INT):INT -> interpret_basic._pow;
_pow(x:INT,y:REAL):REAL -> interpret_basic._pow;
_pow(x:REAL,y:INT):REAL -> interpret_basic._pow;
_pow(x:REAL,y:REAL):REAL -> interpret_basic._pow;
rand(max:INT): INT -> interpret_basic._randIntMax;
rand(min:INT,max:INT): INT -> interpret_basic._randIntMinMax;
randZ(min:INT,max:INT): INT -> interpret_basic._randIntMinMaxZ;
sin(x:INT): REAL -> interpret_basic._sin;
sin(x:REAL): REAL -> interpret_basic._sin;
cos(x:INT): REAL -> interpret_basic._cos;
cos(x:REAL): REAL -> interpret_basic._cos;
tan(x:INT): REAL -> interpret_basic._tan;
tan(x:REAL): REAL -> interpret_basic._tan;
asin(x:INT): REAL -> interpret_basic._asin;
asin(x:REAL): REAL -> interpret_basic._asin;
acos(x:INT): REAL -> interpret_basic._acos;
acos(x:REAL): REAL -> interpret_basic._acos;
atan(x:INT): REAL -> interpret_basic._atan;
atan(x:REAL): REAL -> interpret_basic._atan;
exp(x:INT):REAL -> interpret_basic._exp;
exp(x:REAL):REAL -> interpret_basic._exp;
sqrt(x:INT): REAL -> interpret_basic._sqrt;
sqrt(x:REAL): REAL -> interpret_basic._sqrt;
abs(x:INT):INT -> interpret_basic._abs;
abs(x:REAL):REAL -> interpret_basic._abs;
floor(x:INT): INT -> interpret_basic._floor;
floor(x:REAL): INT -> interpret_basic._floor;
ceil(x:INT): INT -> interpret_basic._ceil;
ceil(x:REAL): INT -> interpret_basic._ceil;
round(x:INT): INT -> interpret_basic._round;
round(x:REAL): INT -> interpret_basic._round;
sign(x:INT): INT -> interpret_basic._sign;
sign(x:REAL): INT -> interpret_basic._sign;
max(list:INT_LIST): INT -> interpret_basic._maxInt;
fac(x:INT): INT -> interpret_basic._fac;
binomial(n:INT,k:INT): INT -> interpret_basic._binomial;
set(elements:INT_LIST): SET_INT -> interpret_set._createIntSet;
set(elements:COMPLEX_LIST): SET_COMPLEX -> interpret_set._createComplexSet;
len(s:SET_INT): INT -> interpret_set._lenSet;
_unaryMinus(x:COMPLEX):COMPLEX -> interpret_complex._unaryMinusComplex;
_add(x:COMPLEX,y:COMPLEX):COMPLEX -> interpret_complex._addComplex;
_add(x:INT, y:COMPLEX): COMPLEX -> interpret_complex._addNumberComplex;
_add(x:REAL, y:COMPLEX): COMPLEX -> interpret_complex._addNumberComplex;
_add(x:COMPLEX, y:INT): COMPLEX -> interpret_complex._addComplexNumber;
_add(x:COMPLEX, y:REAL): COMPLEX -> interpret_complex._addComplexNumber;
_sub(x:COMPLEX,y:COMPLEX):COMPLEX -> interpret_complex._subComplex;
_sub(x:INT, y:COMPLEX): COMPLEX -> interpret_complex._subNumberComplex;
_sub(x:REAL, y:COMPLEX): COMPLEX -> interpret_complex._subNumberComplex;
_sub(x:COMPLEX, y:INT): COMPLEX -> interpret_complex._subComplexNumber;
_sub(x:COMPLEX, y:REAL): COMPLEX -> interpret_complex._subComplexNumber;
_mul(x:COMPLEX,y:COMPLEX):COMPLEX -> interpret_complex._mulComplex;
_div(x:COMPLEX,y:COMPLEX):COMPLEX -> interpret_complex._divComplex;
_mul(x:INT,y:COMPLEX):COMPLEX -> interpret_complex._mulNumberComplex;
_mul(x:REAL,y:COMPLEX):COMPLEX -> interpret_complex._mulNumberComplex;
_mul(x:COMPLEX,y:INT):COMPLEX -> interpret_complex._mulComplexNumber;
_mul(x:COMPLEX,y:REAL):COMPLEX -> interpret_complex._mulComplexNumber;
_pow(x:COMPLEX,y:COMPLEX):COMPLEX -> interpret_complex._powComplexComplex;
_pow(x:COMPLEX, y:INT):COMPLEX -> interpret_complex._powComplexNumber;
_pow(x:COMPLEX, y:REAL):COMPLEX -> interpret_complex._powComplexNumber;
_pow(x:INT,y:COMPLEX):COMPLEX -> interpret_complex._powNumberComplex;
_pow(x:REAL,y:COMPLEX):COMPLEX -> interpret_complex._powNumberComplex;
conj(x:COMPLEX):COMPLEX -> interpret_complex._conjComplex;
complex(x:INT,y:INT):COMPLEX -> interpret_complex._complex;
complex(x:INT,y:REAL):COMPLEX -> interpret_complex._complex;
complex(x:REAL,y:INT):COMPLEX -> interpret_complex._complex;
complex(x:REAL,y:REAL):COMPLEX -> interpret_complex._complex;
real(x:COMPLEX): REAL -> interpret_complex._extractComplexReal;
imag(x:COMPLEX): REAL -> interpret_complex._extractComplexImag;
sqrtC(x:INT): COMPLEX -> interpret_complex._sqrtC_number;
sqrtC(x:REAL): COMPLEX -> interpret_complex._sqrtC_number;
sqrtC(x:COMPLEX): COMPLEX -> interpret_complex._sqrtC_complex;
abs(x:COMPLEX): REAL -> interpret_complex._absComplex;
_add(x:VECTOR,y:VECTOR):VECTOR -> interpret_vector._addVectors;
_sub(x:VECTOR,y:VECTOR):VECTOR -> interpret_vector._subVectors;
_mul(x:INT,y:VECTOR):VECTOR -> interpret_vector._mulScalarVector;
_mul(x:REAL,y:VECTOR):VECTOR -> interpret_vector._mulScalarVector;
dot(x:VECTOR, y:VECTOR): REAL -> interpret_vector._dotVectors;
cross(x:VECTOR, y:VECTOR): VECTOR -> interpret_vector._crossVectors;
norm2(x:VECTOR): REAL -> interpret_vector._norm2vec;
zeros<size:INT>(): VECTOR -> interpret_vector._zerosVector;
rand<size:INT>(min:INT, max:INT): VECTOR -> interpret_vector._randVector;
randZ<size:INT>(min:INT, max:INT): VECTOR -> interpret_vector._randZVector;
is_zero(x:VECTOR): BOOL -> interpret_vector._isVectorZero;
_add(x:MATRIX,y:MATRIX):MATRIX -> interpret_matrix._addMatrices;
_sub(x:MATRIX,y:MATRIX):MATRIX -> interpret_matrix._subMatrices;
_mul(x:INT,y:MATRIX):MATRIX -> interpret_matrix._mulScalarMatrix;
_mul(x:REAL,y:MATRIX):MATRIX -> interpret_matrix._mulScalarMatrix;
_mul(x: MATRIX, y: INT): MATRIX -> interpret_matrix._mulMatrixScalar;
_mul(x: MATRIX, y: REAL): MATRIX -> interpret_matrix._mulMatrixScalar;
_mul(x:MATRIX,y:MATRIX):MATRIX -> interpret_matrix._mulMatrices;
rand<rows:INT,columns:INT>(min:INT,max:INT): MATRIX -> interpret_matrix._randMatrix;
randZ<rows:INT,columns:INT>(min:INT,max:INT): MATRIX -> interpret_matrix._randZMatrix;
det(x:MATRIX): REAL -> interpret_matrix._det;
min(x:MATRIX): REAL -> interpret_matrix._minMatrix;
max(x:MATRIX): REAL -> interpret_matrix._maxMatrix;
zeros<rows:INT,columns:INT>(): MATRIX -> interpret_matrix._zeros;
ones<rows:INT,columns:INT>(): MATRIX -> interpret_matrix._ones;
floor(x:MATRIX): MATRIX -> interpret_matrix._floorMatrix;
ceil(x:MATRIX): MATRIX -> interpret_matrix._ceilMatrix;
round(x:MATRIX): MATRIX -> interpret_matrix._roundMatrix;
transpose(x:MATRIX): MATRIX -> interpret_matrix._transposeMatrix;
triu(x:MATRIX): MATRIX -> interpret_matrix._triu;
linsolve(A:MATRIX,b:VECTOR): VECTOR -> interpret_matrix._linsolve;
matrix(v:VECTOR_LIST): MATRIX -> interpret_matrix._matrixFromVectors;
rank(A:MATRIX): INT -> interpret_matrix._rank;
is_zero(x:MATRIX): BOOL -> interpret_matrix._isMatrixZero;
is_invertible(x:MATRIX): BOOL -> interpret_matrix._isMatrixInvertible;
inv(x:MATRIX): MATRIX -> interpret_matrix._invMatrix;
_mod(x:MATRIX,y:INT):MATRIX -> interpret_matrix._modMatrix;
_numberToTerm(x:INT):TERM -> interpret_term._numberToTerm;
_add(x:TERM,y:INT):TERM -> interpret_term._addTermReal;
_add(x:TERM,y:REAL):TERM -> interpret_term._addTermReal;
_add(x:INT,y:TERM):TERM -> interpret_term._addRealTerm;
_add(x:REAL,y:TERM):TERM -> interpret_term._addRealTerm;
_add(x:TERM,y:TERM):TERM -> interpret_term._addTermTerm;
_sub(x:TERM,y:INT):TERM -> interpret_term._subTermReal;
_sub(x:TERM,y:REAL):TERM -> interpret_term._subTermReal;
_sub(x:INT,y:TERM):TERM -> interpret_term._subRealTerm;
_sub(x:REAL,y:TERM):TERM -> interpret_term._subRealTerm;
_sub(x:TERM,y:TERM):TERM -> interpret_term._subTermTerm;
_mul(x:TERM,y:INT):TERM -> interpret_term._mulTermReal;
_mul(x:TERM,y:REAL):TERM -> interpret_term._mulTermReal;
_mul(x:INT,y:TERM):TERM -> interpret_term._mulRealTerm;
_mul(x:REAL,y:TERM):TERM -> interpret_term._mulRealTerm;
_mul(x:TERM,y:TERM):TERM -> interpret_term._mulTermTerm;
_div(x:TERM,y:INT):TERM -> interpret_term._divTermReal;
_div(x:TERM,y:REAL):TERM -> interpret_term._divTermReal;
_div(x:INT,y:TERM):TERM -> interpret_term._divRealTerm;
_div(x:REAL,y:TERM):TERM -> interpret_term._divRealTerm;
_div(x:TERM,y:TERM):TERM -> interpret_term._divTermTerm;
_pow(x:TERM,y:INT):TERM -> interpret_term._powTermReal;
_pow(x:TERM,y:REAL):TERM -> interpret_term._powTermReal;
_pow(x:INT,y:TERM):TERM -> interpret_term._powRealTerm;
_pow(x:REAL,y:TERM):TERM -> interpret_term._powRealTerm;
_pow(x:TERM,y:TERM):TERM -> interpret_term._powTermTerm;
sin(x:TERM): TERM -> interpret_term._sinTerm;
cos(x:TERM): TERM -> interpret_term._cosTerm;
tan(x:TERM): TERM -> interpret_term._tanTerm;
exp(x:TERM): TERM -> interpret_term._expTerm;
diff(x:TERM, varId:TERM): TERM -> interpret_term._diffTerm;
ode(lhs:TERM,rhs:TERM): TERM -> interpret_term._ode;

`;

