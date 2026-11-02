# Next.js and Authentication Dependency Security Release

## Incident

The repository had already moved to a patched Node.js release, but the frozen production graph still
contained Next.js, Auth.js and transitive versions with published critical/high advisories.

## Resolution

- Moved the 15.5 maintenance line to Next.js 15.5.28 without changing major version.
- Forced sharp 0.35.5 because the prior frozen resolution still selected 0.34.5.
- Updated Auth.js to 5.0.0-beta.32 and compatible NestJS/TypeORM/client dependencies.
- Used narrow pnpm overrides for affected transitive packages.
- Re-ran the live production audit until no high or critical finding remained.

## Lesson

Updating a direct manifest is insufficient. Verify the resolved lockfile, installed package and
native/image dependency separately. Keep network-dependent advisory checks outside the offline CI
gate, but run and retain them before releases.

## References

- [Next.js security update, 14 October 2026](https://nextjs.org/blog/nextjs-security-update-october-14-2026)
- [Node.js 24.22.1 security release](https://nodejs.org/en/blog/release/v24.22.1/)

## Last Updated

2 November 2026 - Added the dependency remediation record
