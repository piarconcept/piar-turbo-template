# Node.js Brotli Security Release

## Summary

The template pinned Node.js `24.20.0`, which was in the affected 24.x line when the Node.js project
published CVE-2026-111497. The runtime contract was moved to the fixed Node.js `24.22.1` LTS
release without widening the framework or application dependency scope.

## Date

2026-10-23

## Status

- [x] Resolved
- [ ] Follow-up needed

## Area

- Package or app: repository runtime contract and both NestJS BFFs
- Environment: local development, GitHub Actions, and documented container deployment

## Symptoms

- The exact runtime pin predated the 21 October 2026 Node.js security release.
- The official advisory classified a Brotli decoder out-of-bounds write as high severity and
  identified remote code execution as the impact.

## Impact

Any service that decoded attacker-controlled Brotli data under the affected Node.js runtime could
be exposed. The template does not prove that every derived product exercises the vulnerable path,
so the safe response is to update the runtime contract rather than rely on application behavior.

## Root Cause

Exact runtime pins prevent unreviewed drift, but they also require an explicit repository update
when the Node.js project publishes a security release. Node.js `24.20.0` was correctly pinned for
reproducibility but no longer met the minimum safe 24.x version after the advisory.

## Resolution

- Pinned `.nvmrc` to Node.js `24.22.1`.
- Raised every repository-owned `engines.node` floor to `>=24.22.1 <25`.
- Kept GitHub Actions derived from `.nvmrc` and updated active runtime and container documentation.
- Preserved historical `24.20.0` migration evidence while marking the security follow-up in the
  Catalonia OS backport audit.

## Verification

- Tests updated: runtime-contract regression fixture follows the new engine floor.
- Commands run: `pnpm install --lockfile-only`, `pnpm install --frozen-lockfile`, and `pnpm verify`.
- Manual verification: Node.js and Brotli versions were read from the patched runtime process.

## Prevention

- Keep `.nvmrc` as the only exact runtime owner and make CI consume it.
- Treat Node.js security releases as a coordinated change to `.nvmrc`, engines, active docs,
  container examples, the frozen lockfile, and the complete verification gate.
- Do not solve runtime CVEs by adding unrelated framework or application dependency upgrades.

## Related Changes

- Files: `.nvmrc`, runtime-owning manifests, runtime tests, active docs, and `CHANGELOG.md`
- Advisory: `https://nodejs.org/en/blog/vulnerability/october-2026-security-releases`
- Release: `https://nodejs.org/en/blog/release/v24.22.1`
- Related docs: `docs/features/repository-configuration.md` and
  `docs/features/github-workflows.md`

## Last Updated

23 October 2026 - Recorded the Node.js 24.22.1 remediation for CVE-2026-111497
