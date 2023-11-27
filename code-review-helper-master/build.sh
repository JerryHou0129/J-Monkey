#!/bin/bash
set -e
echo '===============begin build==============='
rm -rf dist
babel src  --out-dir ./dist --extensions '.ts'
npx tsc --emitDeclarationOnly
npx tsc --declarationMap --emitDeclarationOnly
mkdir dist/bin
cp bin/index.js dist/bin/index.js
echo '===============done build==============='
