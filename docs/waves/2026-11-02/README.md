# 2 November 2026 Security Baseline Wave

## Objective

Harden the reusable template, update vulnerable runtime/framework dependencies, add negative-path
tests, and leave auditable engineering evidence without claiming certification.

## Execution Order

1. Inventory applications, data, trust boundaries and dependency graph.
2. Fix critical/high authentication, authorization, disclosure, validation and dependency findings.
3. Add secure browser/network defaults and abuse controls.
4. Add repeatable checks, focused tests, control evidence, operations and residual-risk records.
5. Run the frozen full verification, publish one coherent commit, and smoke-check the remote branch.

## Rollback

Revert the security-baseline commit and redeploy the previous immutable artifact. Do not restore any
credential rotated because of possible exposure. No schema migration is part of this wave.

## Scope Boundary

Only `piar-turbo-template` is in scope. Catalonia OS and all external production systems are out of
scope. Source publication is the only deployment available in this repository.

## Last Updated

2 November 2026 - Added the security baseline execution record
