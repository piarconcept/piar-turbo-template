# Learning Log

This directory stores short operational notes for resolved bugs, incidents, regressions, and important fixes.

Use it to preserve debugging knowledge that would otherwise stay trapped in chat threads, PR comments, or memory.

Architecture root causes belong in `docs/architecture/fixes/`. Use this directory for reusable operational lessons that are not primarily structural.

## Rules

- Keep entries in English.
- Create one file per incident or root cause.
- Use the filename format `YYYY-MM-DD-short-slug.md`.
- Start new entries from `TEMPLATE.md`.
- Add the newest entry to the top of the index below.
- If a fix changes a stable workflow or architecture rule, also update the relevant document in `docs/features/`.
- If the root cause is structural, create an architecture fix note instead and cross-link it when useful.

## Index

- `2026-11-02-nextjs-auth-dependency-security-release.md` - Patched the resolved Next.js, sharp,
  Auth.js and production dependency graph and verified zero high/critical advisories
- `2026-10-23-node-brotli-security-release.md` - Updated the exact Node.js runtime to remediate the
  high-severity Brotli decoder vulnerability
- `2026-09-09-node24-runtime-compatibility.md` - Migrated the exact Node.js runtime without framework drift and added native compatibility tests
- `2026-06-05-format-check-deleted-files.md` - Format check failed on tracked files deleted in the working tree

## Last Updated

2 November 2026 - Added the Next.js/Auth.js dependency security remediation
