# Control and Evidence Register

This register maps engineering evidence to common control objectives. It is intentionally
non-exhaustive and does not claim conformity, certification, or audit assurance.

| Control objective                 | Repository evidence                                                           | Status                                                    | Baseline relevance                                                       |
| --------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| Risk-based secure change          | Dated wave, security report, changelog, reviewed commits                      | Implemented for this change                               | SOC 2 CC, ISO/IEC 27001 ISMS planning/change themes                      |
| Asset and data inventory          | `docs/security/README.md` system inventory                                    | Template scope documented                                 | SOC 2 CC, ISO/IEC 27001 context/assets, ISO/IEC 27701 PII inventory      |
| Strong authentication boundary    | JWT startup validation, token-type guard, admin guard                         | Implemented; MFA/revocation open                          | SOC 2 logical access, ISO/IEC 27001 access control                       |
| Least privilege and authorization | Admin-only controllers and negative guard/use-case tests                      | Implemented for current routes                            | SOC 2 logical access, ISO/IEC 27001 authorization                        |
| Secure input handling             | Global `ValidationPipe`, bounded DTO decorators                               | Implemented                                               | SOC 2 processing integrity, ISO/IEC 27001 secure development             |
| Abuse resistance                  | Global and auth-specific throttles                                            | Single-instance baseline                                  | SOC 2 availability/security, ISO/IEC 27001 capacity/security             |
| Secret management                 | No default secret; redacted scanner; rotation runbook                         | Source baseline implemented                               | SOC 2 confidentiality, ISO/IEC 27001 secrets/access                      |
| Dependency and runtime integrity  | Exact Node/Next/sharp versions, frozen lock, audit command                    | No known high/critical production advisory at review time | SOC 2 change/security, ISO/IEC 27001 vulnerability management            |
| Secure network policy             | Exact CORS parser, production fail-closed behavior, client credentials opt-in | Implemented                                               | SOC 2 confidentiality, ISO/IEC 27001 network security                    |
| Browser hardening                 | CSP, anti-framing, no-sniff, permissions/referrer policy                      | Implemented with CSP residual risk                        | SOC 2 security, ISO/IEC 27001 web protection                             |
| Safe errors and audit correlation | Generic responses and random event IDs; no raw PII logs                       | Implemented                                               | SOC 2 monitoring, ISO/IEC 27001 logging/privacy                          |
| Privacy minimization              | Allowlisted fields, consent requirement, generic reset response               | Implemented for current contact/auth flows                | ISO/IEC 27701 PII processing/minimization                                |
| Incident response                 | `operations-runbook.md` severity, containment, evidence and recovery flow     | Procedure supplied; exercise not proven                   | SOC 2 incident response, ISO/IEC 27001 incident management               |
| Backup and recovery               | Product gate and restore evidence checklist                                   | Not implemented by template                               | SOC 2 availability, ISO/IEC 27001 continuity                             |
| Supplier/AI processing            | No AI provider enabled; review gate documented                                | Not applicable until enabled                              | SOC 2 vendor controls, ISO/IEC 27001 suppliers, ISO/IEC 27701 processors |
| Climate context                   | Organizational relevance decision explicitly required                         | Open for adopter                                          | ISO/IEC 27001:2022/Amd 1:2024                                            |

## Evidence Commands

```bash
nvm use 24.22.1
corepack enable
corepack prepare pnpm@10.28.0 --activate
pnpm install --frozen-lockfile
pnpm verify
pnpm security:audit
```

`pnpm verify` is offline after the frozen install and is the required CI signal. `pnpm
security:audit` queries a live advisory service, so run it during scheduled security review and
before release; record date, result, reviewer, and remediation decision outside the repository when
evidence retention is required.

## Last Updated

2 November 2026 - Added the first control-to-evidence mapping
