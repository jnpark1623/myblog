#!/usr/bin/env bash
# Safe deploy: prove the build works, push, then confirm the live site is
# actually serving the pushed commit — so "didn't deploy" vs "not reflected yet"
# is never ambiguous again.
#
# Usage: bash scripts/deploy.sh        (commit first, then run this)
# Assumes changes are already committed on the current branch.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

NODE="/opt/homebrew/bin/node"
LIVE_VERSION_URL="https://www.mnpark.info/api/version"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
SHA="$(git rev-parse HEAD)"

echo "==> 1/3 build gate (next build)"
# Vercel fails the deploy if next build fails (incl. ESLint/prettier errors),
# leaving the old version live. Catch that here BEFORE pushing.
rm -rf .next
"$NODE" node_modules/next/dist/bin/next build >/tmp/deploy-build.log 2>&1 || {
  echo "BUILD FAILED — not pushing. Last lines:" >&2
  tail -30 /tmp/deploy-build.log >&2
  exit 1
}
echo "    build OK"

echo "==> 2/3 push ${BRANCH} (${SHA:0:8})"
git push origin "$BRANCH"

echo "==> 3/3 waiting for live deploy to serve ${SHA:0:8}"
for i in $(seq 1 40); do
  live="$(curl -s "$LIVE_VERSION_URL" | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write((JSON.parse(s).sha)||"")}catch{process.stdout.write("?")}})' 2>/dev/null || echo "?")"
  ts="$(date +%H:%M:%S)"
  if [ "$live" = "$SHA" ]; then
    echo "[$ts] LIVE ✓ deployment is serving ${SHA:0:8}"
    exit 0
  fi
  echo "[$ts] try $i: live=${live:0:8} (waiting…)"
  sleep 15
done

echo "TIMEOUT: live site did not report ${SHA:0:8} within ~10 min." >&2
echo "Check the Vercel dashboard for a failed/stuck build." >&2
exit 1
