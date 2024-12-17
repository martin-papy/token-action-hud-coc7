#!/bin/sh

set -e
set -x

ls -al build/artifacts

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
  MODULE="${REL}/module.json"
  MANIFEST="${BASE}/0.0.0/module.json"
  OTHER_ZIP="${BASE}/0.0.0/token-action-hud-coc7.zip"

  curl --header "JOB-TOKEN: $CI_JOB_TOKEN" --upload-file build/artifacts/token-action-hud-coc7.zip "${ZIP}"
  curl --header "JOB-TOKEN: $CI_JOB_TOKEN" --upload-file build/artifacts/token-action-hud-coc7.zip "${OTHER_ZIP}"
  curl --header "JOB-TOKEN: $CI_JOB_TOKEN" --upload-file build/artifacts/module.json "${MODULE}"
fi
