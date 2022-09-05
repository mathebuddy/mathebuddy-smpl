/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { SMPL_Interpreter } from './interpret';
import { SMPL_Parser } from './parse';
import { SymTabEntry } from './symbol';

export function interpret(src: string, printCode = false): SymTabEntry[] {
  // parse code
  const parser = new SMPL_Parser();
  const code = parser.parse(src);
  const locals = parser.getLocalSymbols();
  // print code
  if (printCode) {
    console.log(code);
  }
  // interpret code
  const interpreter = new SMPL_Interpreter();
  interpreter.interpret(code, locals);
  // return locals
  return locals;
}
