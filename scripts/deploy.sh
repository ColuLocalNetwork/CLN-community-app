#!/bin/sh

set -e

if ! [ -n "$NO_INSTALL" ]
then
  npm i lerna --registry https://registry.npmjs.org/
  npm run bootstrap --registry https://registry.npmjs.org/
fi

cp dist/* ../server/public

cd ../server

if ! [ -n "$NO_INSTALL" ]
then
  npm i lerna --registry https://registry.npmjs.org/
  npm run bootstrap --registry https://registry.npmjs.org/
fi
