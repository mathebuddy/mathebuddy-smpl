/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as esbuild from 'esbuild';

esbuild.buildSync({
  platform: 'node',
  minify: true,
  target: 'node11',
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'build/mathebuddy-smpl.min.js',
});
