#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
scratch_dir=""

cleanup() {
  if [[ -n "${scratch_dir}" && -d "${scratch_dir}" ]]; then
    rm -rf "${scratch_dir}"
  fi
}

trap cleanup EXIT

run_step() {
  local label="$1"
  shift

  printf '\n[%s]\n' "${label}"
  "$@"
}

run_in_scratch() {
  local label="$1"
  shift

  printf '\n[%s]\n' "${label}"
  (
    cd "${scratch_dir}/repo"
    CI=true "$@"
  )
}

cd "${repo_root}"

if ! command -v rsync >/dev/null 2>&1; then
  echo "verify requires rsync to prepare an isolated workspace copy." >&2
  exit 1
fi

status_before="$(git status --porcelain=v1 --untracked-files=all)"

run_step "1/10 generated artifact check" pnpm artifacts:check

scratch_dir="$(mktemp -d "${TMPDIR:-/tmp}/piar-verify.XXXXXX")"
mkdir -p "${scratch_dir}/repo"

rsync \
  -a \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude '.pnpm-store/' \
  --exclude '.turbo/' \
  --exclude 'coverage/' \
  --exclude 'dist/' \
  --exclude '.next/' \
  --exclude '.runtime/' \
  --exclude 'cdk.out/' \
  --exclude '.serverless/' \
  "${repo_root}/" \
  "${scratch_dir}/repo/"

run_in_scratch "2/10 reproducible install" pnpm install --frozen-lockfile
run_in_scratch "3/10 build" pnpm build
run_in_scratch "4/10 typecheck" pnpm typecheck
run_in_scratch "5/10 format check" pnpm format:check
run_in_scratch "6/10 test participation policy" pnpm test:policy
run_in_scratch "7/10 tests without coverage" pnpm test
run_in_scratch "8/10 lint" pnpm lint

run_step "9/10 generated artifact check" pnpm artifacts:check

status_after="$(git status --porcelain=v1 --untracked-files=all)"

if [[ "${status_before}" != "${status_after}" ]]; then
  echo
  echo "10/10 git status drift detected"
  echo "verify must not change the visible worktree."
  echo
  echo "Before:"
  printf '%s\n' "${status_before:-<clean>}"
  echo
  echo "After:"
  printf '%s\n' "${status_after:-<clean>}"
  exit 1
fi

echo
echo "10/10 git status unchanged"
echo "verify completed successfully without mutating the worktree."
