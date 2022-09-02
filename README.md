# Simple Math Programming Language (SMPL) for the web

SMPL is a math-oriented programming language that can be interpreted in the browser. Its primary use is for the **mathe:buddy** app.

SMPL's syntax is basically a subset of JavaScript, but extended with instrinsic mathematical data types (e.g. matrices) and operator overloading for these types. SMPL uses MathJS (and later on e.g. TensorFlow) for core calculations.

Many concepts (and also parts of the source code) are taken from the **Simple E-Learning Language** (SELL) https://sell.f07-its.fh-koeln.de.

Compared to SELL, SMPL is Turing Complete: It allows e.g. loops and conditions.

## Notes related to the "mathe:buddy" project

We will also support writing code for random questions in Python, Octave, Maxima and SageMath.

SMPL has the following advantage:

- NO server is required. Code is executed at client-side. There is no need to install anything
- simple syntax with intrinsic data types for math
- no need to import math libraries explicitly

## Usage

**attention: not yet working!**

```
npm install mathebuddy-smpl
```

```
import { SMPL } from 'mathebuddy-smpl';

const src = `
// create two (3x3)-matrices A and B, with random
// (integral) entries in range [-5,5] without zero.
let A:B = randZ<3,3>(-5,5);
let C = A * B;
`;

const variables = SMPL.interpret();

for (const v of variables) {
  console.log(v.id + ' = ' + v.value.toString());
}
```

## Syntax

Detailed description: work-in-progress

## Grammar

TODO: yet incomplete!

```
program = { statement };
statement = declaration | if | for | do | while | switch | function | return | break | continue | expression EOS;
declaration = "let" ID { ":" ID } "=" expr { "," ID { ":" ID } "=" expr } EOS;
expression = or { ("="|"+="|"-="|"/=") or };
or = and { "||" and };
and = equal { "&&" equal };
equal = relational [ ("=="|"!=") relational ];
relational = add [ ("<="|">="|"<"|">") add ];
add = mul { ("+"|"-") mul };
mul = unary { ("*"|"/") unary };
unary = unaryExpression [ unaryPostfix ];
unaryExpression = INT | IMAG | REAL | "(" expr ")" | ID;
unaryPostfix = "++" | "--" | "(" [ expr { "," expr } ] ")" | "[" expr "]";
for = "for" "(" expression ";" expression ";" expression ")" block;
if = "if" "(" expression ")" block [ "else" block ];
block = statement | "{" { statement } "}";
do = "do" block "while" "(" expr ")" EOS;
while = "while" "(" expr ")" block;
switch = "switch" "(" expr ")" "{" { "case" INT ":" { statement } } "default" ":" { statement } "}";
function = "function" ID "(" [ ID { "," ID } ] ")" block;
return = "return" [ expr ] EOS;
break = "break" EOS;
continue = "continue" EOS;
```

## Developer Notes

File `src/prototypes.ts` declares function prototypes. These must be implemented for the interpreter in file `src/interpret.ts`.

Example: Create support for a function `abs(..)` for real and complex numbers.

1. Insert the following lines into `const functions` in file `src/prototypes.ts`:

```
abs(x:REAL):REAL -> _absReal;
abs(x:COMPLEX): REAL -> _absComplex;
```

Since the function is overloaded with two different types (and JavaScript does not support function overloading), use must map it to two different function IDs (`_absReal` and `_absComplex`).

2. Add two private methods to class `SMPL_Interpreter` in file `src/interpret.ts`:

```
private _absReal(x: number): number {
  return Math.abs(x);
}

private _absComplex(x: mathjs.MathCollection): number {
  return mathjs.abs(x) as number;
}
```

The first method uses Vanilla JavaScript function `Math.abs(..)` to calculate the absolute values of a real number.

the second method uses MathJS to calculate the absolute value of a complex number.

Any third party math library written (or compiled to) JavaScript may be included.
