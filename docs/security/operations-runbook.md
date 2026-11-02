# Security Operations Runbook

## Credential Exposure and Rotation

Treat every credential pasted into chat, a ticket, logs, screenshots, or source history as exposed.
Do not copy the value into an incident record.

1. Identify the provider, account, environment, permissions, last use, and dependent workloads from
   metadata only.
2. Revoke or disable the exposed credential in the provider's secure console.
3. Create a replacement with the smallest required scope and a new identifier.
4. Store it in the approved secret manager; never in source, `.env.example`, CI logs, or chat.
5. Redeploy only affected workloads and verify successful authentication.
6. Prove the old credential fails, review access logs from the exposure window, and record evidence.
7. Rotate any credential derived from or sharing trust with the exposed value.

The repository scanner reports only path and finding type. It must never print a candidate secret.

## Incident Response

1. **Triage:** assign incident lead, severity, start time, affected assets/data, and evidence owner.
2. **Contain:** revoke credentials, isolate affected deployment, block abusive traffic, or roll back.
3. **Preserve evidence:** retain immutable timestamps, artifact digest, commit, event IDs, provider
   audit records, and operator actions. Avoid copying PII into the incident timeline.
4. **Eradicate:** patch the root cause, rotate trust, remove persistence, and rebuild from the frozen
   dependency graph.
5. **Recover:** deploy through staging/canary, run smoke checks, monitor error and access signals.
6. **Notify:** follow contractual and legal deadlines determined by the product owner/privacy lead.
7. **Learn:** document root cause, control failure, owner, due date, and recurrence test.

## Release and Rollback

Release plan:

1. Build with Node.js `24.22.1` and `pnpm install --frozen-lockfile`.
2. Require `pnpm verify` and a current `pnpm security:audit` with no high/critical finding.
3. Record commit SHA, artifact digest, lockfile digest, approver, and target environment.
4. Deploy to staging, then verify health, anonymous/user/admin negative paths, CORS, CSP,
   `Cache-Control`, error redaction, login/reset throttling, and database connectivity.
5. Promote the same immutable artifact through a canary or bounded rollout and monitor.

Rollback plan:

1. Stop promotion and redeploy the previously approved immutable artifact.
2. This baseline has no database migration, so application rollback does not require schema rollback.
3. If credentials were rotated, do not restore an exposed credential; issue another secure value.
4. Repeat health/authz/header smoke tests and record the rollback result.

The repository has no deployment target or credentials. Publishing source is not a production
deployment; each adopter must connect this plan to its authorized runtime.

## Backup and Recovery Gate

Before production, the product owner must approve data classes, backup scope, encryption/key owner,
region, retention, RPO, RTO, restore authority, and deletion/legal-hold behavior. A successful backup
job is not recovery evidence. At least one isolated restore exercise must record:

- backup identifier and source timestamp,
- restored environment and dataset boundaries,
- integrity/application checks,
- measured recovery point and recovery time,
- operator, approver, exceptions, and cleanup.

## Upload and AI Opt-In Gates

Uploads remain disabled until limits, content detection, generated storage keys, private storage,
malware scanning, authorization, retention and deletion are designed and tested. AI providers
remain disabled until data categories, purpose, lawful basis, processor terms, training/retention
settings, region, logging, redaction, human review and incident handling are approved.

## Last Updated

2 November 2026 - Added rotation, incident, release, recovery and opt-in procedures
