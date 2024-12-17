#!/bin/bash

set -euo pipefail
set -x

#npm install --save-dev babel-eslint

cat > .eslintrc.js << EOF 
module.exports = {
  parser: "/usr/local/lib/node_modules/@babel/eslint-parser",
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false,
    },
    requireConfigFile: false,
  },
};
EOF

#npx eslint ./src/
eslint ./scripts/

# Locate and complain about extraneous console logging
if find scripts/ -type f |xargs grep 'console.log('; then
  echo "console.log found, exiting..."
  exit 1
fi
