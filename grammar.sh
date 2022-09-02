#!/bin/bash
echo "# extracted from src/parse.ts with ./grammar.sh" > grammar.txt
cat src/parse.ts | grep //G | cut -c7- >> grammar.txt
