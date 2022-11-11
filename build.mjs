/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as esbuild from 'esbuild';
import { execSync } from 'child_process';
import * as fs from 'fs';

// ---- build ----
esbuild.buildSync({
  platform: 'node',
  minify: false, // TODO
  target: 'node11',
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'build/mathebuddy-smpl.min.js',
});

// ---- convert README.md to README.html ----
const date = new Date().toISOString().slice(0, 10);
execSync("sed -e '1,/<!-- start-for-website -->/d' smpl.md > __tmp.md");
execSync(
  'pandoc -s __tmp.md --metadata title="SIMPLE MATH PROGRAMMING LANGUAGE (SMPL)" --metadata author="" --metadata date="' +
    date +
    '"  --css README.css --embed-resources --standalone -o smpl.html',
);
execSync('rm __tmp.md');
// TODO: --mathjax may be needed, but results in large file, if --self-contained option is provided...

const title = `<h1 class="title">`;
const links =
  `[<a href="https://app.f07-its.fh-koeln.de">Home</a>] ` +
  `[<a href="https://app.f07-its.fh-koeln.de/docs-mbl.html">MBL Reference</a>] ` +
  `[<a href="https://app.f07-its.fh-koeln.de/docs-smpl.html">SMPL Reference</a>]`;
fs.writeFileSync(
  'smpl.html',
  fs.readFileSync('smpl.html', 'utf-8').replace(title, links + title),
);
