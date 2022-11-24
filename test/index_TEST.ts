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

/*const variables = SMPL.interpret(
  `let f(x) = x^2 * (5+x) + sin(1) + sin(x);`,
  true,
);*/

/*const variables = SMPL.interpret(`let A:B = randZ<3,3>(-5,5);
let C = A * B;
let d = det(C);
let f(x) = x^2;
`);

for (const v of variables) {
  console.log(v.id + ' = ' + v.value.toString());
}*/

// manual test
console.log('--- running manual test in file index_TEST.ts ---');
const variables = SMPL.interpret(
  `let u:v = rand<3>(-5,5);
let s = dot(u,v);
`,
  true,
);

for (const v of variables) {
  console.log(v.id + ' = ' + v.value.toString());
}

// test examples
import * as glob from 'glob';
import * as fs from 'fs';
import * as process from 'process';
import { SymTabEntry } from '../src/symbol';

const path_list = glob.sync('examples/test_*.txt');
for (const path of path_list) {
  console.log('--- ' + path + ' ---');
  const input = fs.readFileSync(path, 'utf-8');
  let variables: SymTabEntry[] = [];
  try {
    variables = SMPL.interpret(input);
  } catch (e) {
    console.log('ERROR: ' + e);
    process.exit(-1);
  }
  for (const v of variables) {
    console.log(v.id + ' = ' + v.value.toString());
  }
  const bp = 1337;
}

// REMEMBER: run "./build.sh" after changing grammar!
