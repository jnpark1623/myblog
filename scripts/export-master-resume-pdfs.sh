#!/usr/bin/env bash
# Print the master resume HTML pages to PDF using headless Chrome so the PDFs
# always match the current card-layout design and latest content.
#
# Source HTML: public/cv-noo10mi4km/resumes/<slug>.html (self-contained, links
# ../assets/resume-viewer.css), printed via file:// so no dev server is needed.
# Output PDFs: public/cv-noo10mi4km/pdf/<slug>.pdf
#
# Run this AFTER scripts/sync-cv-public.js so the public HTML is up to date.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RESUMES_DIR="$ROOT/public/cv-noo10mi4km/resumes"
PDF_DIR="$ROOT/public/cv-noo10mi4km/pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

SLUGS=(
  "master-base-resume"
  "master-backend-resume"
  "master-po-pm-resume"
)

mkdir -p "$PDF_DIR"

for slug in "${SLUGS[@]}"; do
  src="$RESUMES_DIR/$slug.html"
  out="$PDF_DIR/$slug.pdf"
  if [[ ! -f "$src" ]]; then
    echo "[export-pdf] missing source: $src" >&2
    exit 1
  fi
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
    --print-to-pdf="$out" "file://$src" 2>/dev/null
  echo "[export-pdf] $slug.pdf"
done

echo "[export-pdf] done -> $PDF_DIR"
