#!/usr/bin/env bash
# Install sf-package-list into a fresh scratch project and check the programmatic API
# the way an external consumer would: types via `tsc`, runtime via node.
#
# Usage: scripts/api-consumer/run.sh <package-spec>
#   <package-spec> is a local tarball or a registry spec, e.g.
#     ./sf-package-list-3.3.0.tgz      (pre-publish, from `npm pack`)
#     sf-package-list@3.3.0            (post-publish, from the registry)
set -euo pipefail

SPEC="${1:?usage: run.sh <package-spec>}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HERE="$REPO_ROOT/scripts/api-consumer"
SAMPLES="$REPO_ROOT/test/samples"

if [[ -f "$SPEC" ]]; then
  # Resolve a local tarball to an absolute path before leaving the repo. On Windows (Git Bash),
  # `pwd -W` gives a native path that npm understands.
  TARBALL_DIR="$(cd "$(dirname "$SPEC")" && (pwd -W 2>/dev/null || pwd))"
  SPEC="$TARBALL_DIR/$(basename "$SPEC")"
fi

WORK="$(mktemp -d)"
trap 'rm -rf "${WORK:?}"' EXIT
echo "Consumer project: $WORK"
echo "Installing: $SPEC"

cd "$WORK"
echo '{ "name": "api-consumer", "private": true, "type": "module" }' >package.json
npm install --no-audit --no-fund --loglevel=error "$SPEC" typescript @types/node
cp "$HERE/check.mjs" "$HERE/types.ts" "$HERE/tsconfig.json" .
mkdir -p out

# Read package.json from disk: the exports map does not expose "./package.json".
VERSION="$(node -p "require('./node_modules/sf-package-list/package.json').version")"
echo "Installed: sf-package-list@$VERSION"

echo "--- Type check"
npx --no-install tsc -p tsconfig.json
echo "ok - published types compile"

echo "--- Runtime check"
node check.mjs "$SAMPLES" "$WORK/out"
