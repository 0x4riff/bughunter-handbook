<div align="center">

# Bughunter Handbook

**Field notes for finding, validating, and reporting web security bugs.**

[![Markdown checks](https://github.com/0x4riff/bughunter-handbook/actions/workflows/markdown.yml/badge.svg)](https://github.com/0x4riff/bughunter-handbook/actions/workflows/markdown.yml)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/license-CC%20BY--SA%204.0-2b6cb0.svg)](LICENSE)
[![Topics](https://img.shields.io/badge/topics-16-111827.svg)](#handbook-map)
[![Made for bug hunters](https://img.shields.io/badge/made%20for-bug%20hunters-7c3aed.svg)](#who-this-is-for)

*Less payload collecting. More careful thinking.*

[Start with the workflow](docs/01-testing-workflow.md) · [Tips & tricks](docs/03-field-tips.md) · [Browse techniques](#technique-playbooks) · [Use templates](#field-kit)

</div>

---

## Why This Handbook Exists

Bug bounty notes tend to grow into a pile of payloads, screenshots, and half-finished ideas. That pile can be useful, but it rarely tells you what to do when a target behaves in a way you did not expect.

This handbook takes a different approach. It starts with the rule a feature is supposed to enforce, then works backward from evidence. The goal is not to send more requests. The goal is to understand what changed, why it matters, and whether it crosses a real security boundary.

> **Working rule:** an odd response is a lead. It becomes a finding only after you can show a broken rule, reproduce it, and explain its impact.

## Who This Is For

- New hunters who want a repeatable process instead of a giant payload list.
- Experienced hunters who need compact notes during manual testing.
- AppSec teams looking for practical test ideas and clean report structure.
- Anyone who prefers proof over severity guesses.

## Handbook Map

<table>
<tr>
<td width="50%" valign="top">

### Foundations

**[Rules of Engagement](docs/00-rules-of-engagement.md)**<br>
Know where to stop before testing begins.

**[Testing Workflow](docs/01-testing-workflow.md)**<br>
Move from feature mapping to a minimal proof.

**[Evidence & Reporting](docs/02-evidence-and-reporting.md)**<br>
Turn a promising lead into a report another person can verify.

</td>
<td width="50%" valign="top">

### Access & Application Logic

**[Authorization & IDOR](docs/authorization.md)**<br>
Test actors, objects, actions, tenants, and object states.

**[Business Logic](docs/business-logic.md)**<br>
Look for skipped steps, replayed actions, stale state, and broken invariants.

**[403 Responses](docs/403-testing.md)**<br>
Separate real access-control failures from status-code noise.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Browser & JavaScript

**[Cross-Site Scripting](docs/xss.md)**<br>
Trace untrusted input to browser execution context.

**[Prototype Pollution](docs/prototype-pollution.md)**<br>
Follow dangerous keys to a reachable security effect.

</td>
<td width="50%" valign="top">

### APIs & Exposure

**[GraphQL](docs/graphql.md)**<br>
Review resolver authorization, query cost, and API-specific edges.

**[Exposed Files](docs/exposed-files.md)**<br>
Validate sensitive files without turning discovery into blind brute force.

**[Exposed Development Files](docs/exposed-development-files.md)**<br>
Use targeted paths, baseline calibration, secret triage, Git evidence levels, and report-ready proof.

</td>
</tr>
</table>

## Technique Playbooks

Practical checks for newer and easily missed attack surfaces:

| Playbook | What it covers |
| :--- | :--- |
| [Field Tips & Tricks](docs/03-field-tips.md) | Baselines, role comparison, state transitions, official-client traffic, unique markers, and dead-end notes |
| [API Testing Techniques](docs/api-techniques.md) | Object, property, and function authorization; versions; bulk jobs; pagination; sensitive flows |
| [OAuth & OpenID Connect](docs/oauth-techniques.md) | Redirect binding, state, nonce, PKCE, issuer, audience, account linking, token lifecycle |
| [Race Conditions](docs/race-conditions.md) | Single-use actions, multi-endpoint races, safe concurrency, authoritative state checks |
| [Modern Web Techniques](docs/modern-web-techniques.md) | Cache deception, URL fetchers, uploads, browser messaging, AI features, third-party API trust |
| [Exposed Development Files](docs/exposed-development-files.md) | Environment files, Git metadata, IDE artifacts, soft-404 calibration, secret triage, reports, remediation |

Techniques stay intentionally small and scope-aware. This is a field guide, not a request-flooding cookbook.

## A Workflow You Can Reuse

```text
Pick a feature
    |
Write down its security rule
    |
Capture normal behavior
    |
Change one variable
    |
Compare data + final state
    |
Rule out boring explanations
    |
Build the smallest safe proof
    |
Report what you can prove
```

Every topic in this repository follows that rhythm. You can use it on a small REST endpoint, a multi-step checkout, or a GraphQL resolver without rebuilding your process each time.

## Field Kit

| Resource | Use it when |
| :--- | :--- |
| [Target notes](templates/target-notes.md) | Starting a new program or feature review |
| [Finding report](templates/finding-report.md) | Turning verified behavior into a submission |
| [Authorization matrix](templates/authorization-matrix.csv) | Comparing roles, tenants, objects, states, and actions |
| [Development-files wordlist](wordlists/dev-files.txt) | Running a small evidence-led artifact check within program limits |
| [Pull request checklist](.github/pull_request_template.md) | Adding or improving a handbook chapter |

## What You Will Not Find Here

- Claims based only on response size or timing.
- Endless payload dumps without context.
- Advice to ignore program scope.
- Inflated severity language.
- Real credentials, private target data, or user records.

## Quick Start

1. Read [Rules of Engagement](docs/00-rules-of-engagement.md).
2. Copy [Target Notes](templates/target-notes.md) into your private workspace.
3. Pick one feature and write its expected security rule.
4. Follow [Testing Workflow](docs/01-testing-workflow.md).
5. Use [Finding Report](templates/finding-report.md) only after impact is repeatable.

## Keeping Techniques Current

Security advice changes. Protocol guidance and platform behavior matter more than social-media payload trends. See [References & Further Study](docs/references.md) for maintained OWASP guidance, Web Security Academy material, and OAuth 2.0 Best Current Practice.

## Contributing

Good additions do not need to be long. A useful chapter explains a security rule, shows how to investigate it safely, calls out common dead ends, and keeps every claim tied to evidence. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Responsible Use

Use this material only on systems you own or have explicit permission to test. Program scope and rules always come first. Keep proofs small, protect user data, and stop before a test can affect production stability.

## License

Documentation is available under [CC BY-SA 4.0](LICENSE).
