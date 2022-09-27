/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as SMPL from '../src/index';

// --- hello world

/*let variables = SMPL.interpret(
  `// Hello, world!
let z = rand(3);
let x = 3 + 4*5;
let y = x + 1;
let w = y^2;
let b = (true && false) || !true;
while (x > 0) {
  x = x - 1;
}
do {
  x = x + 1;
} while(x < 5);
if (x == 5) {
  y = 666;
} else {
  y = 7;
}
`,
  true,
);

for (const v of variables) {
  console.log(v.id + ' = ' + v.value.toString());
}

// --- matrix operations

variables = SMPL.interpret(
  `let A:B = randZ<2,2>(-5,5);
let C = A * B;
let D = randZ<3,2>(-5,5);
//let E = A + D;
`,
  true,
);

for (const v of variables) {
  console.log(v.id + ' = ' + v.value.toString());
}*/

// ---

const variables = SMPL.interpret(
  `let f(x) = x^2 * (5+x) + sin(1) + sin(x);`,
  true,
);

for (const v of variables) {
  console.log(v.id + ' = ' + v.value.toString());
}
