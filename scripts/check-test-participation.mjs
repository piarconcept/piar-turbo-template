#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const policyPath = path.join(repoRoot, 'docs', 'records', 'test-participation-policy.json');
const workspaceRoots = ['apps', 'packages'];
const skippedDirectoryNames = new Set([
  '.git',
  'node_modules',
  '.pnpm-store',
  '.turbo',
  '.next',
  'coverage',
  'dist',
  '.runtime',
  'cdk.out',
  '.serverless',
]);
const testFilePattern = /\.(test|spec)\.(c|m)?[jt]sx?$/;

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function escapeRegex(value) {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function globToRegex(pattern) {
  let regexSource = '^';

  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    const nextCharacter = pattern[index + 1];

    if (character === '*' && nextCharacter === '*') {
      regexSource += '.*';
      index += 1;
      continue;
    }

    if (character === '*') {
      regexSource += '[^/]*';
      continue;
    }

    regexSource += escapeRegex(character);
  }

  regexSource += '$';
  return new RegExp(regexSource);
}

function collectWorkspacePackageDirectories(directoryPath, results) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

  if (entries.some((entry) => entry.isFile() && entry.name === 'package.json')) {
    results.push(directoryPath);
  }

  for (const entry of entries) {
    if (!entry.isDirectory() || skippedDirectoryNames.has(entry.name)) {
      continue;
    }

    collectWorkspacePackageDirectories(path.join(directoryPath, entry.name), results);
  }
}

function collectTestFiles(directoryPath, results) {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skippedDirectoryNames.has(entry.name)) {
        continue;
      }

      collectTestFiles(path.join(directoryPath, entry.name), results);
      continue;
    }

    if (testFilePattern.test(entry.name)) {
      results.push(entry.name);
    }
  }
}

function isVitestCommand(script) {
  return /\bvitest\b/.test(script ?? '');
}

function requiresFlag(script, flag) {
  return (script ?? '').includes(flag);
}

function loadPolicy() {
  return JSON.parse(fs.readFileSync(policyPath, 'utf8'));
}

function validatePolicyShape(policy, errors) {
  if (!Array.isArray(policy.allowedNoTestPatterns)) {
    errors.push('`allowedNoTestPatterns` must be an array.');
  }

  if (!policy.packages || typeof policy.packages !== 'object') {
    errors.push('`packages` must be an object keyed by workspace path.');
  }
}

const errors = [];
const policy = loadPolicy();
validatePolicyShape(policy, errors);

const allowedNoTestPatterns = (policy.allowedNoTestPatterns ?? []).map((entry) => ({
  ...entry,
  matcher: globToRegex(entry.pattern),
}));

for (const entry of allowedNoTestPatterns) {
  if (entry.kind !== 'exception') {
    errors.push(
      `Pattern ${entry.pattern} must use kind "exception"; risk gaps must be listed explicitly.`,
    );
  }

  if (!entry.reason) {
    errors.push(`Pattern ${entry.pattern} is missing a reason.`);
  }
}

const documentedPackages = new Map(Object.entries(policy.packages ?? {}));
const workspacePackageDirectories = [];

for (const workspaceRoot of workspaceRoots) {
  const fullWorkspaceRoot = path.join(repoRoot, workspaceRoot);

  if (fs.existsSync(fullWorkspaceRoot)) {
    collectWorkspacePackageDirectories(fullWorkspaceRoot, workspacePackageDirectories);
  }
}

const workspacePackages = workspacePackageDirectories
  .map((packageDirectory) => {
    const manifestPath = path.join(packageDirectory, 'package.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const testFiles = [];
    collectTestFiles(packageDirectory, testFiles);

    return {
      directoryPath: packageDirectory,
      relativePath: toPosixPath(path.relative(repoRoot, packageDirectory)),
      manifest,
      manifestPath,
      scripts: manifest.scripts ?? {},
      hasRealTests: testFiles.length > 0,
      usesVitest:
        Boolean(manifest.dependencies?.vitest) ||
        Boolean(manifest.devDependencies?.vitest) ||
        fs.existsSync(path.join(packageDirectory, 'vitest.config.ts')),
    };
  })
  .sort((left, right) => left.relativePath.localeCompare(right.relativePath));

const workspacePackageMap = new Map(
  workspacePackages.map((workspacePackage) => [workspacePackage.relativePath, workspacePackage]),
);

for (const [relativePath] of documentedPackages) {
  if (!workspacePackageMap.has(relativePath)) {
    errors.push(`Policy entry ${relativePath} does not match any workspace package or app.`);
  }
}

const summary = {
  exception: 0,
  'real-tests': 0,
  'risk-gap': 0,
};

for (const workspacePackage of workspacePackages) {
  const documentedEntry = documentedPackages.get(workspacePackage.relativePath);
  const matchedPattern = allowedNoTestPatterns.find((entry) =>
    entry.matcher.test(workspacePackage.relativePath),
  );

  if (workspacePackage.hasRealTests && documentedEntry) {
    errors.push(
      `${workspacePackage.relativePath} is listed in the no-test policy but already has real tests.`,
    );
  }

  let participationKind = 'real-tests';

  if (!workspacePackage.hasRealTests) {
    if (documentedEntry) {
      if (!['exception', 'risk-gap'].includes(documentedEntry.kind)) {
        errors.push(
          `${workspacePackage.relativePath} has unsupported kind ${documentedEntry.kind}.`,
        );
      }

      if (!documentedEntry.reason) {
        errors.push(`${workspacePackage.relativePath} is missing a reason in the policy.`);
      }

      if (documentedEntry.kind === 'risk-gap') {
        if (!documentedEntry.risk) {
          errors.push(`${workspacePackage.relativePath} is missing a documented risk.`);
        }

        if (!documentedEntry.mitigation) {
          errors.push(`${workspacePackage.relativePath} is missing a documented mitigation.`);
        }
      }

      participationKind = documentedEntry.kind;
    } else if (matchedPattern) {
      participationKind = matchedPattern.kind;
    } else {
      errors.push(
        `${workspacePackage.relativePath} has no real tests and no documented exception or risk gap.`,
      );
    }
  }

  if (!workspacePackage.hasRealTests && workspacePackage.usesVitest) {
    if (!isVitestCommand(workspacePackage.scripts.test)) {
      errors.push(
        `${workspacePackage.relativePath} uses vitest without tests and must run vitest in \`test\`.`,
      );
    }

    if (!requiresFlag(workspacePackage.scripts.test, '--run')) {
      errors.push(
        `${workspacePackage.relativePath} must use \`vitest --run --passWithNoTests\` for \`test\`.`,
      );
    }

    if (!requiresFlag(workspacePackage.scripts.test, '--passWithNoTests')) {
      errors.push(`${workspacePackage.relativePath} must use \`--passWithNoTests\` for \`test\`.`);
    }

    if (requiresFlag(workspacePackage.scripts.test, '--coverage')) {
      errors.push(
        `${workspacePackage.relativePath} must keep coverage out of the normal \`test\` script.`,
      );
    }

    if (!isVitestCommand(workspacePackage.scripts['test:coverage'])) {
      errors.push(
        `${workspacePackage.relativePath} uses vitest without tests and must run vitest in \`test:coverage\`.`,
      );
    }

    if (!requiresFlag(workspacePackage.scripts['test:coverage'], '--run')) {
      errors.push(
        `${workspacePackage.relativePath} must use \`vitest --run --coverage --passWithNoTests\` for \`test:coverage\`.`,
      );
    }

    if (!requiresFlag(workspacePackage.scripts['test:coverage'], '--coverage')) {
      errors.push(`${workspacePackage.relativePath} must keep coverage in \`test:coverage\`.`);
    }

    if (!requiresFlag(workspacePackage.scripts['test:coverage'], '--passWithNoTests')) {
      errors.push(
        `${workspacePackage.relativePath} must use \`--passWithNoTests\` for \`test:coverage\`.`,
      );
    }
  }

  if (workspacePackage.hasRealTests) {
    if (!workspacePackage.scripts.test) {
      errors.push(
        `${workspacePackage.relativePath} has real tests but is missing a \`test\` script.`,
      );
    }

    if (!workspacePackage.scripts['test:coverage']) {
      errors.push(
        `${workspacePackage.relativePath} has real tests but is missing a \`test:coverage\` script.`,
      );
    }

    if (requiresFlag(workspacePackage.scripts.test, '--coverage')) {
      errors.push(
        `${workspacePackage.relativePath} must keep coverage out of the normal \`test\` script.`,
      );
    }

    if (workspacePackage.usesVitest) {
      if (!isVitestCommand(workspacePackage.scripts.test)) {
        errors.push(
          `${workspacePackage.relativePath} has real vitest tests but \`test\` does not run vitest.`,
        );
      }

      if (!requiresFlag(workspacePackage.scripts.test, '--run')) {
        errors.push(`${workspacePackage.relativePath} must use \`vitest --run\` for \`test\`.`);
      }

      if (requiresFlag(workspacePackage.scripts.test, '--passWithNoTests')) {
        errors.push(
          `${workspacePackage.relativePath} has real tests and must not allow \`--passWithNoTests\` in \`test\`.`,
        );
      }

      if (!isVitestCommand(workspacePackage.scripts['test:coverage'])) {
        errors.push(
          `${workspacePackage.relativePath} has real vitest tests but \`test:coverage\` does not run vitest.`,
        );
      }

      if (!requiresFlag(workspacePackage.scripts['test:coverage'], '--run')) {
        errors.push(
          `${workspacePackage.relativePath} must use \`vitest --run --coverage\` for \`test:coverage\`.`,
        );
      }

      if (!requiresFlag(workspacePackage.scripts['test:coverage'], '--coverage')) {
        errors.push(`${workspacePackage.relativePath} must keep coverage in \`test:coverage\`.`);
      }

      if (requiresFlag(workspacePackage.scripts['test:coverage'], '--passWithNoTests')) {
        errors.push(
          `${workspacePackage.relativePath} has real tests and must not allow \`--passWithNoTests\` in \`test:coverage\`.`,
        );
      }
    }
  }

  summary[participationKind] += 1;
}

if (errors.length > 0) {
  console.error('Test participation policy failed:');

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log('Test participation summary:');
console.log(`- real-tests: ${summary['real-tests']}`);
console.log(`- documented-exceptions: ${summary.exception}`);
console.log(`- documented-risk-gaps: ${summary['risk-gap']}`);
console.log(`- checked-workspaces: ${workspacePackages.length}`);
