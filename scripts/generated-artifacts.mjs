#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const mode = process.argv[2];
const repoRoot = process.cwd();
const generatedDirectoryNames = new Set([
  'coverage',
  '.runtime',
  'cdk.out',
  'dist',
  '.next',
  '.serverless',
]);
const skippedDirectoryNames = new Set(['.git', 'node_modules', '.pnpm-store', '.turbo']);

if (!['check', 'clean'].includes(mode)) {
  console.error('Usage: node scripts/generated-artifacts.mjs <check|clean>');
  process.exit(1);
}

const gitLsFiles = spawnSync('git', ['ls-files'], {
  cwd: repoRoot,
  encoding: 'utf8',
});

if (gitLsFiles.status !== 0) {
  console.error('Unable to inspect tracked files with git.');
  process.exit(gitLsFiles.status ?? 1);
}

const trackedFiles = gitLsFiles.stdout
  .split('\n')
  .filter(Boolean)
  .map((entry) => entry.trim());

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function hasTrackedFiles(relativeDirectoryPath) {
  const normalizedDirectoryPath = toPosixPath(relativeDirectoryPath).replace(/\/$/, '');
  const prefix = `${normalizedDirectoryPath}/`;

  return trackedFiles.some(
    (trackedFile) => trackedFile === normalizedDirectoryPath || trackedFile.startsWith(prefix),
  );
}

function collectGeneratedDirectories(directoryPath, results) {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    if (skippedDirectoryNames.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directoryPath, entry.name);
    const relativePath = path.relative(repoRoot, fullPath);

    if (generatedDirectoryNames.has(entry.name)) {
      if (!hasTrackedFiles(relativePath)) {
        results.add(toPosixPath(relativePath));
      }

      continue;
    }

    collectGeneratedDirectories(fullPath, results);
  }
}

const discoveredArtifacts = new Set();
collectGeneratedDirectories(repoRoot, discoveredArtifacts);

const artifacts = [...discoveredArtifacts].sort();

if (mode === 'clean') {
  if (artifacts.length === 0) {
    console.log('No generated artifacts to clean.');
    process.exit(0);
  }

  for (const artifact of artifacts) {
    fs.rmSync(path.join(repoRoot, artifact), {
      force: true,
      recursive: true,
    });
    console.log(`Removed ${artifact}`);
  }

  process.exit(0);
}

if (artifacts.length > 0) {
  console.error('Generated artifacts detected:');

  for (const artifact of artifacts) {
    console.error(`- ${artifact}`);
  }

  console.error('Run `pnpm artifacts:clean` to remove them before verify.');
  process.exit(1);
}

console.log('No generated artifacts detected.');
