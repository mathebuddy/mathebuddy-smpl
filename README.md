# Simple Math Programming Language (SMPL) for the web

SMPL is a math-oriented programming language that can be interpreted in the browser. Its primary use is for the **mathe:buddy** app.

SMPL's syntax is basically a subset of JavaScript, but extended with instrinsic mathematical data types (e.g. matrices) and operator overloading for these types. SMPL uses MathJS (and later on e.g. TensorFlow) for core calculations.

Many concepts (and also parts of the source code) are taken from the **Simple E-Learning Language** (SELL) https://sell.f07-its.fh-koeln.de.

Compared to SELL, SMPL is Turing Complete: It allows e.g. loops and conditions.

SMPL is easily **extendible**. Refer to the _Developer Notes_ below.

## Notes related to the "mathe:buddy" project

We will also support writing code for random questions in Python, Octave, Maxima and SageMath.

SMPL has the following advantage:

- **No** server is required. Code is executed at client-side. There is no need to install anything
- Simple syntax with intrinsic data types for math
- No need to import math libraries explicitly

## Example

Copy the following code to `https://npm.runkit.com/` and run it!

```javascript
var SMPL = require('@mathebuddy/mathebuddy-smpl');

let src = `
// create two (3x3)-matrices A and B, with random
// (integral) entries in range [-5,5] without zero.
let A:B = randZ<3,3>(-5,5);
let C = A * B;
`;

let variables = SMPL.interpret(src);

for (let v of variables) {
  console.log(v.id + ' = ' + v.value.toString());
}
```

## Installation

```
npm install @mathebuddy/mathebuddy-smpl
```

## Language Definition

SMPL is (mostly) an imperative, typed language. Its base syntax is derived from JavaScript.

### Programs

### Data Types

boolean (`BOOL`), integer (`INT`), real (`REAL`), term (`TERM`), matrix (`MATRIX`), vector (`VECTOR`), set (`SET`), complex (`COMPLEX`).

### Declarations

Declarations are initiated with keyword `let`, followed by an identifier and finally assigned expression by `=`.
The expression in the right-hand side is mandatory to derive the data type.

> Example

```
let x = 5;
let y = 7, z = 9.1011;
let u = rand(5);
let v = zeros<2,3>();
let a : b = rand<3,3>(-2, 2);
let c :/ d :/ e = rand<3,3>(-2, 2);
```

- Variables `x` and `u` are integral. The value for `u` is randomly chosen from set {0,1,2,3,4,5}.
- Variable `z` is a real valued.
- Variables `x` and `z` are declared together (without any semantical relation). The notation is equivalent to `let y=7; let y=9.1011;`
- Variables `v`, `a`, `b`, `c` and `d` are matrices. `v` is a zero matrix with two rows and three columns.
- Matrices `a` and `b` consist of randomly chosen, integral elements in range [-2,2].
- The colon separator `:` evaluates the right-hand side to each of the variables: `let a = rand<3,3>(-2, 2); let b = rand<3,3>(-2, 2);`. Accordingly, elements for `a` and `b` are drawn individually.
- Separator `:/` guarantees that no pair of matrices `c`, `d` and `e` is equal.

### Expressions

List of operators, ordered by increasing precedence:

| Operator           | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `\|\|`             | Logical Or                                               |
| `&&`               | Logical And                                              |
| `==`,`!=`          | Equal, Unequal                                           |
| `<`, `<=`,`>`,`>=` | Less than, Less or equal, Greater than, Greater or equal |
| `+`, `-`           | Addition, Subtraction                                    |
| `*`, `/`           | Multiplication, Division                                 |
| `^`                | Potency                                                  |
| `++`, `--`         | Postfix Incrementation, Decrementation                   |

Base data types are evaluated at compile-time. Properties like e.g. matrix dimensions are evaluated at runtime.
Thus, a `RuntimeError` is thrown if e.g. two matrices with a different number of rows are added.

> Example

```
let x = 1.23 * sin(y) + exp(u + 2*w);
let C = A * B^T;
let d = det(C);
```

- The examples assumes, that variables `y`, `u`, `w`, `A`, `B`, `C` have been declared before usage.

### Conditions

> Example

```
let s = 0;
if (x > 0) {
  s=1;
}
else if (x < 0) {
  s = -1;
}
else {
  x=0;
}
```

### Loops

> Example

```
while (x > 0) {
  // body
}
```

> Example

```
for (let i = 0; i < 5; i++) {
  // body
}
```

### Functions

A function consists of a **header** and a **body**:

- The **header** declared the name of the function, its parameter names and types and the return type.
- The **body** is represented by a list of statements and returns a result that is compatible to the return type.

> Example

```
function f(x: INT, y: INT): INT {
  return x + y;
}

let y = f(3, 4);
```

## Grammar

The following formal grammar (denoted in EBNF) is currently implemented.

```ebnf
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
unaryExpression = INT | IMAG | REAL | "(" expr ")" | ID | "-" unary;
unaryPostfix = "++" | "--" | [ "<" [ unary { "," unary } ] ">" ] "(" [ expr { "," expr } ] ")" | "[" expr "]";
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

- Insert the following lines into `const functions` in file `src/prototypes.ts`:

  ```
  abs(x:REAL):REAL -> _absReal;
  abs(x:COMPLEX):REAL -> _absComplex;
  ```

Since the function is overloaded with two different types (and JavaScript does not support function overloading), each must be mapped onto a different function ID (`_absReal` and `_absComplex`).

- Add two private methods to class `SMPL_Interpreter` in file `src/interpret.ts`:

  ```typescript
  private _absReal(x: number): number {
    return Math.abs(x);
    // direct implementation: return x < 0 ? -x : x;
  }

  private _absComplex(x: Complex): number {
    const x_mathjs = x.toMathjs();
    return mathjs.abs(x_mathjs) as number;
    // direct implementation: return Math.sqrt(x.real*x.real + x.imag*x.imag);
  }
  ```

The first method uses Vanilla JavaScript function `Math.abs(..)` to calculate the absolute values of a real number.

The second method uses MathJS to calculate the absolute value of a complex number. Classes `Complex`, `Matrix`, ... provide type conversion methods.

Any third party math library written (or compiled to) JavaScript may be included, but increases the download size of the library (currently less than 200 kiB).
