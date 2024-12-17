#!/bin/bash

set -euo pipefail
set -x

if echo "${CI_COMMIT_TAG}"|grep -E '^(v|rc-|alpha-|beta-)[0-9]+\.[0-9]+\.[0-9]+'; then
  if echo "${CI_COMMIT_TAG}"|grep -E '^v'; then
    BASE="${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/generic/token-action-hud-coc7"
  else
    POST="$(echo ${CI_COMMIT_TAG}|sed 's/^\([a-z]*\)-.*/\1/')"
    BASE="${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/generic/token-action-hud-coc7-${POST}"
  fi
  VERSION=$(echo "${CI_COMMIT_TAG}" | sed 's/[^0-9.]*\([0-9.]*\).*/\1/')
  REL="${BASE}/${VERSION}"
  ZIP="${REL}/token-action-hud-coc7.zip"
  MANIFEST="${REL}/module.json"
  sed -i "s/\"version\":.*/\"version\": \"${VERSION}\",/" module.json
  sed -i "s#\"manifest\":.*#\"manifest\": \"${MANIFEST}\",#" module.json
  sed -i "s#\"download\":.*#\"download\": \"${ZIP}\",#" module.json
  sed -i "s/scripts\/init.js/token-action-hud-coc7.min.js/" module.json
fi

apt-get update -y
apt-get install zip -y
npm i
npm run build
mkdir -p build/token-action-hud-coc7
cp -r languages build/token-action-hud-coc7
cp -r token-action-hud-coc7.min.js build/token-action-hud-coc7
cp -r styles build/token-action-hud-coc7
cp module.json build/token-action-hud-coc7
mkdir -p build/artifacts
cp module.json build/artifacts
cd build
zip -r artifacts/token-action-hud-coc7.zip token-action-hud-coc7/
ls -al artifacts
