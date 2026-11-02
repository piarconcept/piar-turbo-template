import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { inspectSecurityBaseline } from './check-security-baseline.mjs';

async function fixture(overrides = {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'piar-security-baseline-'));
  await mkdir(path.join(root, 'app'), { recursive: true });
  await writeFile(
    path.join(root, 'app/package.json'),
    JSON.stringify({ dependencies: { next: overrides.next ?? '15.5.28' } }),
  );
  await writeFile(
    path.join(root, '.env.example'),
    overrides.environment ?? 'JWT_SECRET=\nNEXTAUTH_SECRET=\n',
  );
  await writeFile(
    path.join(root, 'pnpm-workspace.yaml'),
    `overrides:\n  next: 15.5.28\n  sharp: 0.35.5\n`,
  );
  await writeFile(
    path.join(root, 'pnpm-lock.yaml'),
    `packages:\n  next@15.5.28: {}\n  sharp@0.35.5: {}\n`,
  );
  return root;
}

test('accepts the patched dependency and secret baseline', async () => {
  const root = await fixture();
  try {
    assert.deepEqual(await inspectSecurityBaseline(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('reports paths and finding types without returning a detected credential', async () => {
  const root = await fixture({ environment: 'JWT_SECRET=change-me\n' });
  const token = `ghp_${'A'.repeat(36)}`;
  await writeFile(path.join(root, 'leak.txt'), token);

  try {
    const findings = await inspectSecurityBaseline(root);
    assert.ok(findings.some((finding) => finding.reason === 'weak example secret'));
    assert.ok(findings.some((finding) => finding.reason === 'possible GitHub token'));
    assert.equal(JSON.stringify(findings).includes(token), false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
