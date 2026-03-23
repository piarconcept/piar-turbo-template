# Test Participation Policy

`pnpm verify` enforces test participation before running the workspace test suite.

Rules:

1. Real tests are the default for every app and package.
2. Coverage never belongs to the normal `test` script. Coverage runs only through `test:coverage`.
3. Packages that use `vitest` but do not have real tests must use:
   - `vitest --run --passWithNoTests` for `test`
   - `vitest --run --coverage --passWithNoTests` for `test:coverage`
4. Allowed no-test exceptions may be documented by pattern only for low-risk packages that stay limited to static configuration or type-only surfaces.
5. Risk gaps must be documented explicitly per package with:
   - `reason`
   - `risk`
   - `mitigation`
6. A new package without real tests fails the policy unless it matches a documented exception or has an explicit risk-gap entry.
7. If a package gains real tests, its exact no-test inventory entry must be removed.

Canonical inventory: [test-participation-policy.json](./test-participation-policy.json)
