/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { SMPL } from '../src';

const variables = SMPL.interpret(`// Hello, world!
let z = rand(3);
let x = 3 + 4*5;
let y = x + 1;
`);

for (const v of variables) {
  console.log(v.id + ' = ' + v.value.toString());
}
