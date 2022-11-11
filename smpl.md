# Simple Math Programming Language (SMPL) Reference

<!-- start-for-website -->

---

**NOTE**
This reference guide is in work-in-progress state. We are planning to release version 1.0 by end of 2022.

---

This document describes the _Simple Math Programming Language (SMPL)_.

SMPL is a math-oriented programming language that can be interpreted in the browser. Its primary use is for the **mathe:buddy** app.

SMPL is (mostly) an imperative, typed language. Its syntax is basically a subset of _JavaScript_, but extends with intrinsic mathematical data types (e.g. terms, sets and matrices) and operator overloading for these types.

The language definition of SMPL is independent of concrete implementations.
A reference implementation can be found [here](https://github.com/mathebuddy/mathebuddy-smpl).
Visit our online [playground](https://mathebuddy.github.io/mathebuddy-smpl/).

### History Notes

Many concepts (and also parts of the source code) are taken from the **Simple E-Learning Language** [SELL](https://sell.f07-its.fh-koeln.de).
Compared to SELL, SMPL is Turing Complete: It allows e.g. loops and conditions.

## Example

```
let A:B = randZ<3,3>(-5,5);
let C = A * B;
```

The example program creates two $3 \times 3$-matrices $A$ and $B$, with random (integral) entries in range [-5,5] without zero.

Matrix $C$ TODO.

## Programs

## Data Types

boolean (`BOOL`), integer (`INT`), rational (`RATIONAL`), real (`REAL`), term (`TERM`), matrix (`MATRIX`), vector (`VECTOR`), set (`SET`), complex (`COMPLEX`).

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
do {
  // body
} while (x > 0);
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
declaration = "let" id_list "=" expr EOS | "let" ID "(" ID { "," ID } ")" "=" expr EOS;
id_list = ID { ":" ID };
expression = or { ("="|"+="|"-="|"/=") or };
or = and { "||" and };
and = equal { "&&" equal };
equal = relational [ ("=="|"!=") relational ];
relational = add [ ("<="|">="|"<"|">") add ];
add = mul { ("+"|"-") mul };
mul = pow { ("*"|"/") pow };
pow = unary [ "^" unary ];
unary = unaryExpression [ unaryPostfix ];
unaryExpression = "true" | "false" | INT | IMAG | REAL | "(" expr ")" | ID | "-" unary | "!" unary;
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
