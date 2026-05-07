#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
scratch_dir=""
status_before_file=""
status_after_file=""

cleanup() {
  if [[ -n "${scratch_dir}" && -d "${scratch_dir}" ]]; then
    rm -rf "${scratch_dir}"
  fi

  if [[ -n "${status_before_file}" && -f "${status_before_file}" ]]; then
    rm -f "${status_before_file}"
  fi

  if [[ -n "${status_after_file}" && -f "${status_after_file}" ]]; then
    rm -f "${status_after_file}"
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

capture_status_snapshot() {
  local output_file="$1"

  git status --porcelain=v1 --untracked-files=all | LC_ALL=C sort >"${output_file}"
}

cd "${repo_root}"

if ! command -v rsync >/dev/null 2>&1; then
  echo "verify requires rsync to prepare an isolated workspace copy." >&2
  exit 1
fi

run_step "1/12 local artifact clean" pnpm artifacts:clean

status_before_file="$(mktemp "${TMPDIR:-/tmp}/piar-verify-status-before.XXXXXX")"
status_after_file="$(mktemp "${TMPDIR:-/tmp}/piar-verify-status-after.XXXXXX")"

capture_status_snapshot "${status_before_file}"

run_step "2/12 generated artifact check" pnpm artifacts:check

scratch_dir="$(mktemp -d "${TMPDIR:-/tmp}/piar-verify.XXXXXX")"
mkdir -p "${scratch_dir}/repo"

rsync \
  -a \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude '.pnpm-store/' \
  --exclude '.turbo/' \
  --exclude 'coverage/' \
  --exclude 'build/' \
  --exclude 'dist/' \
  --exclude '.next/' \
  --exclude 'out/' \
  --exclude '.runtime/' \
  --exclude 'cdk.out/' \
  --exclude '.serverless/' \
  "${repo_root}/" \
  "${scratch_dir}/repo/"

run_in_scratch "3/12 reproducible install" pnpm install --frozen-lockfile
run_in_scratch "4/12 build" pnpm build
run_in_scratch "5/12 typecheck" pnpm typecheck
run_in_scratch "6/12 format check" pnpm format:check
run_in_scratch "7/12 test participation policy" pnpm test:policy
run_in_scratch "8/12 tests without coverage" pnpm test
run_in_scratch "9/12 lint" pnpm lint

run_step "10/12 final local artifact clean" pnpm artifacts:clean
run_step "11/12 generated artifact check" pnpm artifacts:check

capture_status_snapshot "${status_after_file}"

if ! cmp -s "${status_before_file}" "${status_after_file}"; then
  echo
  echo "12/12 git status drift detected"
  echo "verify must not change the visible worktree after local artifact hygiene."
  echo
  echo "Before verify:"
  if [[ -s "${status_before_file}" ]]; then
    cat "${status_before_file}"
  else
    printf '<clean>\n'
  fi
  echo
  echo "After:"
  if [[ -s "${status_after_file}" ]]; then
    cat "${status_after_file}"
  else
    printf '<clean>\n'
  fi
  echo
  echo "Diff:"
  diff -u "${status_before_file}" "${status_after_file}" || true
  exit 1
fi

echo
echo "12/12 git status unchanged"
echo "verify completed successfully and left the worktree artifact-free."
