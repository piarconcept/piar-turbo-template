#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const mode = process.argv[2];
const repoRoot = process.cwd();

if (!['check', 'write'].includes(mode)) {
  console.error('Usage: node scripts/format-files.mjs <check|write>');
  process.exit(1);
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    ...options,
  });
}

function isInsideGitWorkTree() {
  const result = run('git', ['rev-parse', '--is-inside-work-tree']);

  return result.status === 0 && result.stdout.trim() === 'true';
}

function getGitFiles() {
  const result = spawnSync(
    'git',
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
    {
      cwd: repoRoot,
      encoding: 'buffer',
    },
  );

  if (result.status !== 0) {
    console.error('Unable to inspect tracked and untracked files with git.');
    process.exit(result.status ?? 1);
  }

  return result.stdout
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .filter((filePath) => fs.existsSync(path.join(repoRoot, filePath)));
}

const prettierMode = mode === 'write' ? '--write' : '--check';
const prettierArgs = [prettierMode, '--ignore-unknown'];

if (isInsideGitWorkTree()) {
  const files = getGitFiles();

  if (files.length === 0) {
    console.log('No tracked or unignored files to format.');
    process.exit(0);
  }

  prettierArgs.push(...files);
} else {
  prettierArgs.push('.');
}

const prettier = spawnSync('prettier', prettierArgs, {
  cwd: repoRoot,
  stdio: 'inherit',
});

process.exit(prettier.status ?? 1);
