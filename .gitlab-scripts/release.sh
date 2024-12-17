#!/bin/sh

set -e
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
  MODULE="${REL}/module.json"
  MANIFEST="${BASE}/0.0.0/module.json"
  OTHER_ZIP="${BASE}/0.0.0/token-action-hud-coc7.zip"

  release-cli create --name "Release ${VERSION}" --tag-name ${CI_COMMIT_TAG} \
	      --assets-link "{\"name\":\"zip\",\"url\":\"${ZIP}\"}" \
        --assets-link "{\"name\":\"module\",\"url\":\"${MODULE}\"}"
fi
