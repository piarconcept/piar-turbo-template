# Security and Privacy Baseline

This directory defines the reusable security and privacy baseline for the template. It is an
engineering control set and evidence index. It is **not** a SOC 2 report, an ISO/IEC certification,
or proof that a product created from the template is compliant.

## Reference Baselines

- [AICPA Trust Services Criteria](https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022)
- [ISO/IEC 27001:2022](https://www.iso.org/standard/27001)
- [ISO/IEC 27001:2022/Amd 1:2024](https://www.iso.org/standard/88435.html)
- [ISO/IEC 27701:2025](https://www.iso.org/standard/27701)

The mappings in this repository are implementation aids. An organization still needs its own
scope, risk assessment, statement of applicability, policies, owners, evidence period, management
review, internal audit, vendor controls, and independent assessment.

## System Inventory

| Surface                      | Purpose                           | Data handled                                            | Boundary                                 |
| ---------------------------- | --------------------------------- | ------------------------------------------------------- | ---------------------------------------- |
| Public Next.js app           | Public content and contact form   | Contact PII and consent                                 | Browser to web BFF                       |
| Backoffice Next.js app       | Administrative UI                 | Account and submitted contact data                      | Browser to backoffice BFF                |
| Web NestJS BFF               | Public API composition            | Contact submissions and published pages                 | Internet to application/database         |
| Backoffice NestJS BFF        | Authentication and administration | Email, password hashes, roles, content and contact data | Authorized staff to application/database |
| PostgreSQL through TypeORM   | Persistence                       | Product-specific records                                | BFF to database                          |
| GitHub Actions `CI - Verify` | Reproducible verification         | Source and build metadata                               | GitHub runner to package registry        |

No upload endpoint, payment integration, AI provider, active Terraform profile, production secret
manager, production backup service, or production log sink is included in the baseline. Those
capabilities are opt-in and require a product-specific threat and privacy review before activation.

## Implemented Secure Defaults

- Node.js is fixed to `24.22.1`, including the October 2026 Brotli security fix.
- Next.js is fixed to `15.5.28`; `sharp` is forced to `0.35.5` for the image-optimization RCE fix.
- Production dependencies currently have no known high or critical advisory in `pnpm audit --prod`.
- Frozen installs and an offline security baseline check run inside the isolated `pnpm verify` copy.
- DTO bodies are allowlisted, transformed, bounded, and rejected when unknown properties appear.
- Production CORS requires exact, explicit HTTP(S) origins and rejects wildcards and localhost.
- BFF request rates are bounded; authentication endpoints use tighter limits.
- Role changes require a valid access token and the administrator guard.
- Administrator self-demotion and removal of the last administrator are blocked.
- Missing, short, or known-placeholder JWT secrets fail startup.
- Password-reset responses do not disclose account existence.
- Error responses and logs omit raw URLs, submitted values, exception messages, details, and stacks.
- Browser cookies are not sent by the shared HTTP client unless a consumer explicitly opts in.
- Security headers are wired into both Next.js configs. Backoffice responses default to `no-store`.

## Access-Control Matrix

| Action                                 | Anonymous                     | Authenticated user            | Administrator                              | Negative evidence                            |
| -------------------------------------- | ----------------------------- | ----------------------------- | ------------------------------------------ | -------------------------------------------- |
| Login/register/reset request           | Allowed, validated, throttled | Allowed, validated, throttled | Allowed, validated, throttled              | Auth API tests                               |
| Refresh access token                   | Valid refresh token only      | Valid refresh token only      | Valid refresh token only                   | JWT guard/repository tests                   |
| Change a role                          | Denied                        | Denied                        | Allowed, except protected admin invariants | Guard metadata and guard tests               |
| Account/content/contact administration | Denied                        | Denied                        | Allowed                                    | Controller guards and account use-case tests |
| Public content/contact creation        | Allowed, validated, throttled | Allowed                       | Allowed                                    | DTO validation and global throttler          |

Object-level authorization must be added and negatively tested whenever a product introduces
user-owned resources. The template currently exposes administrative collections, not horizontal
user-to-user object access.

## Privacy Baseline

- Data minimization: only DTO allowlisted fields cross the BFF boundary.
- Purpose/consent: public contact submission requires `consent: true`.
- Disclosure minimization: reset and error responses avoid existence and identifier leaks.
- Retention and deletion: not selected by the template; each product must define legal purpose,
  retention, deletion, export, and data-subject request workflows before production.
- Processor/controller records and vendor agreements: product responsibility; no AI provider or
  external processor is activated by default.

## Known Residual Risks

- MFA and refresh-token revocation require product identity and persistence decisions and are not
  implemented by the generic template.
- The rate limiter uses process memory. Multi-instance deployments need a shared trusted store and
  reviewed proxy/IP configuration.
- Next.js still needs `'unsafe-inline'` for the current static CSP integration. Nonces or hashes are
  the next hardening step; `'unsafe-eval'` is already excluded in production.
- Backup restore, production monitoring, vulnerability-response SLAs, RPO/RTO, and log retention
  cannot be proven by a source template. Consumers must test and record them.
- The 2024 climate amendment requires each adopting organization to determine whether climate
  change is relevant to its management-system context and interested parties. The template cannot
  make that organizational determination.

See [control-evidence-register.md](./control-evidence-register.md),
[operations-runbook.md](./operations-runbook.md), and
[security-best-practices-report.md](./security-best-practices-report.md).

## Last Updated

2 November 2026 - Established the auditable security and privacy baseline
