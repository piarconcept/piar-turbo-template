import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const EXPECTED_NEXT_VERSION = '15.5.28';
const EXPECTED_SHARP_VERSION = '0.35.5';
const SKIPPED_DIRECTORIES = new Set([
  '.git',
  '.next',
  '.pnpm-store',
  '.turbo',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'out',
]);

const SECRET_PATTERNS = [
  { name: 'private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'AWS access key', pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  { name: 'GitHub token', pattern: /\bgh[opsu]_[A-Za-z0-9]{36,255}\b/ },
  { name: 'OpenAI project key', pattern: /\bsk-proj-[A-Za-z0-9_-]{20,}\b/ },
  { name: 'Slack token', pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/ },
];

async function listFiles(root, directory = root) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) continue;

    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(root, target)));
    if (entry.isFile() && (await stat(target)).size <= 1024 * 1024) files.push(target);
  }
  return files;
}

function isWeakExampleSecret(contents) {
  return /^(?:JWT_SECRET|NEXTAUTH_SECRET)=(?:change-me|changeme|secret|your-secret-key[^\n]*)$/im.test(
    contents,
  );
}

export async function inspectSecurityBaseline(root) {
  const findings = [];
  const files = await listFiles(root);
  const packageFiles = files.filter((file) => path.basename(file) === 'package.json');

  for (const packageFile of packageFiles) {
    const manifest = JSON.parse(await readFile(packageFile, 'utf8'));
    const declaredNext = manifest.dependencies?.next;
    if (declaredNext && declaredNext !== EXPECTED_NEXT_VERSION) {
      findings.push({ path: packageFile, reason: `Next.js must be ${EXPECTED_NEXT_VERSION}` });
    }
  }

  for (const file of files) {
    let contents;
    try {
      contents = await readFile(file, 'utf8');
    } catch {
      continue;
    }

    if (path.basename(file) === '.env.example' && isWeakExampleSecret(contents)) {
      findings.push({ path: file, reason: 'weak example secret' });
    }

    for (const secret of SECRET_PATTERNS) {
      if (secret.pattern.test(contents)) {
        findings.push({ path: file, reason: `possible ${secret.name}` });
      }
    }
  }

  const workspace = await readFile(path.join(root, 'pnpm-workspace.yaml'), 'utf8');
  if (!workspace.includes(`next: ${EXPECTED_NEXT_VERSION}`)) {
    findings.push({
      path: path.join(root, 'pnpm-workspace.yaml'),
      reason: 'Next.js override drift',
    });
  }
  if (!workspace.includes(`sharp: ${EXPECTED_SHARP_VERSION}`)) {
    findings.push({ path: path.join(root, 'pnpm-workspace.yaml'), reason: 'sharp override drift' });
  }

  const lockfile = await readFile(path.join(root, 'pnpm-lock.yaml'), 'utf8');
  if (!lockfile.includes(`next@${EXPECTED_NEXT_VERSION}:`)) {
    findings.push({ path: path.join(root, 'pnpm-lock.yaml'), reason: 'patched Next.js missing' });
  }
  if (!lockfile.includes(`sharp@${EXPECTED_SHARP_VERSION}:`)) {
    findings.push({ path: path.join(root, 'pnpm-lock.yaml'), reason: 'patched sharp missing' });
  }

  return findings;
}

async function main() {
  const root = path.resolve(process.argv[2] ?? path.dirname(fileURLToPath(import.meta.url)), '..');
  const findings = await inspectSecurityBaseline(root);

  if (findings.length > 0) {
    for (const finding of findings) {
      console.error(`${path.relative(root, finding.path)}: ${finding.reason}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Security baseline verified: Next.js ${EXPECTED_NEXT_VERSION}, sharp ${EXPECTED_SHARP_VERSION}, ` +
      'no weak example secrets, and no recognized high-confidence credential patterns.',
  );
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  await main();
}
