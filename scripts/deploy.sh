#!/bin/sh

set -e

cd dapp

if ! [ -n "$NO_INSTALL" ]
then
  npm i lerna --registry https://registry.npmjs.org/
  npm run bootstrap --registry https://registry.npmjs.org/
fi

npm run build

cp dist/* ../server/public

cd ../server

if ! [ -n "$NO_INSTALL" ]
then
  npm i lerna --registry https://registry.npmjs.org/
  npm run bootstrap --registry https://registry.npmjs.org/
fi
