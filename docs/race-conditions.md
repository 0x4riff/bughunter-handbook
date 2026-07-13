---
title: "Race Conditions"
difficulty: intermediate
estimated_time: "30 minutes"
prerequisites:
  - HTTP basics
  - authorized test environment
last_reviewed: "2026-07"
standards:
  - OWASP WSTG
  - MITRE CWE
---

# Race Conditions

## Table of Contents

- [Find Single-Use Assumptions](#find-single-use-assumptions)
- [Establish Normal Timing](#establish-normal-timing)
- [Verify Authoritative State](#verify-authoritative-state)
- [Watch for Multi-Endpoint Races](#watch-for-multi-endpoint-races)
- [Safety](#safety)
- [Fix Direction](#fix-direction)
- [Candidate Ranking](#candidate-ranking)
- [Report Title Pattern](#report-title-pattern)
- [Prepare Controlled State](#prepare-controlled-state)
- [Synchronization Without Flooding](#synchronization-without-flooding)
- [Single-Endpoint and Multi-Endpoint Races](#single-endpoint-and-multi-endpoint-races)
- [Verify Persistence](#verify-persistence)
- [Evidence Timeline](#evidence-timeline)
- [Remediation](#remediation)

Race conditions appear when two requests act on the same state before either sees the other's result.

## Find Single-Use Assumptions

Good candidates include coupon redemption, invitation acceptance, email verification, password reset, balance transfer, refund, vote, quota use, file processing, and role changes.

Write the invariant first: “This coupon may reduce one controlled order once.” Without an invariant, duplicate responses are hard to interpret.

## Establish Normal Timing

Send requests one at a time and learn the expected state. Then use the smallest allowed concurrency against low-value controlled data. Start with two requests, not hundreds.

## Verify Authoritative State

Two successful responses do not prove a race. Check balance, ledger, order count, quota, token validity, or owner-visible state after processing finishes.

## Watch for Multi-Endpoint Races

The conflict may use different actions: redeem and cancel, invite and revoke, update email and reset password, upload and delete. State transitions reveal these pairs better than endpoint lists.

## Safety

Concurrency tests can create load and irreversible side effects. Follow program rules, avoid financial or scarce inventory impact, and ask before increasing request volume.

## Fix Direction

Use atomic transitions, database constraints, idempotency keys, locking where appropriate, and server-side checks performed inside the same transaction as the state change.

## Candidate Ranking

Prioritize operations with a measurable single-use invariant and a safe controlled asset. Deprioritize endpoints where duplicate responses create no duplicate state.

| Candidate | Invariant | Authoritative check |
| :--- | :--- | :--- |
| coupon | used once per account/order | redemption ledger |
| invite | accepted once before revoke/expiry | membership list |
| reset token | consumed once | token reuse and session state |
| quota | count never drops below zero | quota service or final count |
| refund | one refund per settled item | payment ledger |

## Report Title Pattern

`Race condition allows [single-use transition] to complete [number] times`

## Prepare Controlled State

Create a fresh object for every attempt. Record expected count, balance, status, token validity, and audit entries before concurrency. Learn whether the operation is synchronous or queued.

## Synchronization Without Flooding

Begin with two requests. Keep connection setup and application processing separate when your approved tooling supports it. Increase concurrency only when program rules explicitly allow it and two requests cannot test the invariant.

## Single-Endpoint and Multi-Endpoint Races

Single-endpoint races repeat one action. Multi-endpoint races combine conflicting transitions such as redeem/revoke, approve/cancel, update/reset, or upload/delete. State diagrams help identify pairs.

## Verify Persistence

Wait for workers to finish, refresh from a clean session, and check authoritative ledger or object state. Duplicate responses without duplicate state are not a confirmed race.

## Evidence Timeline

Record request start, response time, request ID, resulting state, and cleanup. Show the sequential baseline beside the concurrent result.

## Remediation

Perform checks and updates atomically. Use database constraints, compare-and-set state, idempotency keys, appropriate isolation or locks, and replay-safe external operations.

---

## Chapter Navigation

[Previous: HTTP Request Smuggling](http-request-smuggling.md) · [Back to README](../README.md) · [Next: Prototype Pollution](prototype-pollution.md)
