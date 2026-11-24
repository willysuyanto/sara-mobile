#!/bin/sh
# Local/CI gate: every check runs even if an earlier one fails.
cd "$(dirname "$0")/.." || exit 1

status=0

run() {
  echo "==> $*"
  if "$@"; then
    echo "PASS: $*"
  else
    echo "FAIL: $*"
    status=1
  fi
}

run yarn lint
run yarn test --runInBand
run yarn prettier --check 'docs/**/*.md'

exit "$status"
