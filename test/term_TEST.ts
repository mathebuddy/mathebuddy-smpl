/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Term } from '../src/term';

// t = 3 + 4*x
const t = Term.Op('+', [
  Term.Const(3),
  Term.Op('*', [Term.Const(4), Term.Var('x')]),
]);
console.log(t.toString());
console.log(t.getVariableIDs());
const d = t.diff('x');
console.log(d.toString());
console.log(d.optimize().toString());
t.setVariableValue('x', 1);
console.log(t.eval());
