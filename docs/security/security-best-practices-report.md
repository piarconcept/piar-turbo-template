# Security Best-Practices Report

Review date: 2 November 2026

Scope: source template only. No production cloud account, database, DNS zone, log sink, secret
manager, backup system, or customer environment was inspected. This report does not assert SOC 2 or
ISO/IEC compliance.

## Resolved Findings

| ID      | Severity | Finding                                                                          | Resolution and evidence                                                                                                |
| ------- | -------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| SEC-001 | Critical | Next.js 15.5.25 and its image stack were below the October 2026 security release | Fixed Next.js at 15.5.28 and sharp at 0.35.5; frozen graph and security check enforce them                             |
| SEC-002 | Critical | Auth.js beta resolved below the security-fixed release                           | Fixed `next-auth` at 5.0.0-beta.32                                                                                     |
| SEC-003 | Critical | Production dependency graph contained critical/high transitive advisories        | Updated compatible direct packages and narrow overrides; live production audit now reports zero high/critical findings |
| SEC-004 | Critical | `PATCH /auth/roles` lacked authentication and administrator guards               | Added JWT/admin guards and negative metadata/guard tests                                                               |
| SEC-005 | High     | Authentication silently used `change-me` when `JWT_SECRET` was absent            | Startup now rejects missing, short and known-placeholder values; examples are blank                                    |
| SEC-006 | High     | Role path could bypass protected administrator invariants                        | Server-derived actor is required; self-demotion and last-admin demotion are blocked                                    |
| SEC-007 | High     | BFF request bodies had Swagger descriptions but no runtime validation            | Added bounded DTO validators and fail-closed global validation pipes                                                   |
| SEC-008 | High     | Error responses/logs included raw URLs, details, messages and stack data         | Added generic serialization, event IDs and metadata-only logs                                                          |
| SEC-009 | High     | Password reset disclosed account existence and submitted email                   | Made success responses identical for existing and absent accounts                                                      |
| SEC-010 | High     | CORS accepted local defaults in production and did not validate configuration    | Added exact-origin parser; production requires explicit non-local origins                                              |
| SEC-011 | High     | Auth and public endpoints had no abuse throttling                                | Added global BFF throttles and stricter auth endpoint policies                                                         |
| SEC-012 | High     | Security-header functions existed but were not connected to Next.js config       | Wired both configs, removed production `unsafe-eval`, restricted connections and disabled backoffice caching           |
| SEC-013 | Medium   | Shared HTTP client sent cookies by default with bearer-token APIs                | Changed to explicit opt-in and added tests                                                                             |
| SEC-014 | Medium   | No repeatable secret/dependency baseline existed inside verify                   | Added redacted scanner, patched-version assertions and CI execution                                                    |

## Open Risks and Required Product Decisions

| ID       | Risk                                                              | Priority                               | Required owner/action                                                               |
| -------- | ----------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------- |
| RISK-001 | No MFA policy or implementation                                   | High before privileged production use  | Identity owner selects factors, recovery, enrollment and enforcement                |
| RISK-002 | Refresh tokens are not server-revocable                           | High before long-lived sessions        | Architecture owner selects revocation/rotation store and incident invalidation path |
| RISK-003 | Rate limiting is in-memory and proxy trust is deployment-specific | High for multi-instance/public scale   | Platform owner adds shared storage and validates trusted proxies                    |
| RISK-004 | CSP retains `'unsafe-inline'`                                     | Medium                                 | Frontend owner migrates to nonces/hashes and verifies Next.js rendering             |
| RISK-005 | No production backup/restore evidence                             | High before persistent production data | Data/platform owners approve RPO/RTO and complete restore exercise                  |
| RISK-006 | Retention, deletion, DSR and vendor records are product-specific  | High before PII production use         | Privacy owner documents purposes, schedules, processors and request workflows       |
| RISK-007 | Vulnerability data is time-dependent                              | Ongoing                                | Run live audit before releases and on an approved schedule                          |

## Verification Summary

- Added 19 focused security tests across authorization, secret policy, account enumeration, error
  redaction, CORS and client credential behavior.
- `pnpm security:check` verifies patched Next.js/sharp, example-secret policy and high-confidence
  credential patterns without printing candidate values.
- `pnpm audit --prod --audit-level high` on 2 November 2026: no high or critical findings; seven
  lower-severity advisories remained for explicit future review.
- Full repository verification must pass before publication; the final commit records that result.

## Last Updated

2 November 2026 - Initial repository-grounded review and remediation report
