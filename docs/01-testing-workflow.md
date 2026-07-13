---
title: "Testing Workflow"
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

# Testing Workflow

## Table of Contents

- [1. Write the Rule First](#1-write-the-rule-first)
- [2. Map the Feature](#2-map-the-feature)
- [3. Capture Clean Baselines](#3-capture-clean-baselines)
- [4. Change One Thing](#4-change-one-thing)
- [5. Check What Happened](#5-check-what-happened)
- [6. Try to Disprove Yourself](#6-try-to-disprove-yourself)
- [7. Stop at the Smallest Proof](#7-stop-at-the-smallest-proof)
- [8. Write for the Reviewer](#8-write-for-the-reviewer)
- [Build a Small Attack-Surface Map](#build-a-small-attack-surface-map)
- [Baseline Pack](#baseline-pack)
- [The One-Variable Table](#the-one-variable-table)
- [Triage Outcomes](#triage-outcomes)
- [Retest for Reproducibility](#retest-for-reproducibility)
- [Workflow Notes Template](#workflow-notes-template)

Random probing sometimes gets lucky. A repeatable workflow gets better as you learn the application.

## 1. Write the Rule First

Before changing a request, finish this sentence:

> Only **[actor]** should be able to **[action]** this **[object]** when **[condition]**.

Example: “Only the author should be able to edit a draft before it is submitted.” Now you know what failure would look like.

## 2. Map the Feature

Use the feature normally. Note the roles, account states, objects, identifiers, read and write actions, and any handoff between web, mobile, API, or background services. You are building a small model, not documenting the whole product.

## 3. Capture Clean Baselines

Record one successful request and one expected denial when possible. Keep method, path, important headers, body, stable response fields, and final application state. Remove credentials from saved notes.

## 4. Change One Thing

Swap one actor, object, action, state, channel, or timing condition. If you change three things and the response changes, you will not know which change mattered.

## 5. Check What Happened

Status codes are clues. Final state is evidence. Compare returned fields, owner-visible state, emails, jobs, quotas, and later behavior. For access-control tests, verify the result from the owner account.

## 6. Try to Disprove Yourself

Before calling it a bug, check for stale sessions, caches, public objects, shared tenant membership, intended role inheritance, echoed input, and jobs that are accepted now but rejected later.

This is not pessimism. It is how good leads survive review.

## 7. Stop at the Smallest Proof

Once the behavior is repeatable with controlled data, stop. More records rarely make the report stronger. They only create more risk.

## 8. Write for the Reviewer

Lead with the broken rule. Then give prerequisites, exact steps, observed state, expected state, impact, and limits. A reviewer should not need to guess why the behavior matters.

## Build a Small Attack-Surface Map

Do not map the whole company before testing one feature. Map what the feature touches:

| Layer | Questions |
| :--- | :--- |
| client | Which request does the official UI send? |
| gateway | Are paths, versions, or methods rewritten? |
| service | Which object and policy should be checked? |
| storage | What is authoritative final state? |
| async | Does a worker repeat validation? |
| integration | Which third party receives or returns data? |

## Baseline Pack

For each important action, save:

- allowed request from the correct actor;
- denied request from a clearly wrong actor;
- object state before and after;
- stable response markers;
- account, tenant, role, and timestamp labels.

A baseline pack prevents expired sessions and product changes from becoming fake findings.

## The One-Variable Table

| Variable | Safe variation |
| :--- | :--- |
| actor | account A versus controlled account B |
| object | equivalent object owned by B |
| action | read versus update or export |
| state | draft versus archived |
| channel | official web request versus official API request |
| time | before and after revoke, expiry, or logout |

## Triage Outcomes

Put each lead into one bucket:

1. **Expected:** policy and observed behavior agree.
2. **Interesting:** response changed, but security effect is unproven.
3. **Confirmed:** controlled data or action crossed a defined boundary.
4. **Unsafe to continue:** next proof may affect users or stability.
5. **Out of scope:** asset or method is not authorized.

Only bucket 3 is report-ready. Bucket 4 needs program guidance.

## Retest for Reproducibility

Repeat from fresh state. If possible, use a new controlled object and a new session. Note prerequisites such as invitation status, feature flags, cached state, or timing windows.

## Workflow Notes Template

```markdown
Security rule:
Actor / object / action / state:
Known-good request:
Changed variable:
Observed response:
Authoritative final state:
Alternative explanation checked:
Smallest repeatable proof:
```

---

## Chapter Navigation

[Previous: Rules of Engagement](00-rules-of-engagement.md) · [Back to README](../README.md) · [Next: Evidence and Reporting](02-evidence-and-reporting.md)
