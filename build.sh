#!/bin/bash
./grammar.sh
cd src
python3 gen_prototypes.py > prototypes.ts
cd ..
tsc --project tsconfig.build.json
node ./build.mjs
cd docs
node ./build.mjs
cd ..
