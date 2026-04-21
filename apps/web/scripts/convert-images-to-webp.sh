#!/usr/bin/env bash
set -euo pipefail

QUALITY="${QUALITY:-82}"
ROOT_DIR="${1:-public/images}"
REPLACE_SOURCE="${2:-}"

if ! command -v cwebp >/dev/null 2>&1; then
  echo "cwebp not found. Install via: brew install webp" >&2
  exit 1
fi

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "Directory not found: $ROOT_DIR" >&2
  exit 1
fi

mapfile -t files < <(find "$ROOT_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) ! -name 'logo.png' | sort)

if [[ ${#files[@]} -eq 0 ]]; then
  echo "No jpg/jpeg/png images found in $ROOT_DIR"
  exit 0
fi

for src in "${files[@]}"; do
  out="${src%.*}.webp"
  cwebp -quiet -q "$QUALITY" "$src" -o "$out"
  echo "Converted: $src -> $out"

  if [[ "$REPLACE_SOURCE" == "--replace" ]]; then
    rm -f "$src"
    echo "Removed: $src"
  fi
done

echo "Done. Converted ${#files[@]} files with quality=$QUALITY"
