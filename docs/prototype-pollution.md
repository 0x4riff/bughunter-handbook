---
title: "Prototype Pollution"
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

# Prototype Pollution

## Table of Contents

- [Trace the Whole Chain](#trace-the-whole-chain)
- [Browser and Server Risk Differ](#browser-and-server-risk-differ)
- [Common Dead Ends](#common-dead-ends)
- [Fix Direction](#fix-direction)
- [Evidence Ladder](#evidence-ladder)
- [Practical Review Targets](#practical-review-targets)
- [Report Title Pattern](#report-title-pattern)
- [Sources and Operations](#sources-and-operations)
- [Dangerous Key Handling](#dangerous-key-handling)
- [Client-Side Gadgets](#client-side-gadgets)
- [Server-Side Risk](#server-side-risk)
- [Dependency Findings](#dependency-findings)
- [Remediation](#remediation)

Prototype pollution begins with an unsafe object operation, but a useful finding needs more: attacker-controlled keys must reach it, shared behavior must change, and a security-relevant gadget must use that change.

## Trace the Whole Chain

1. Find recursive merge, clone, path-set, or query parsing behavior.
2. Confirm which keys an attacker controls.
3. Check filtering at every nesting level.
4. Use a unique harmless property in an isolated test.
5. Follow the changed property to a reachable security effect.

Stopping after “the prototype changed” leaves impact unanswered.

## Browser and Server Risk Differ

In the browser, look for a gadget that changes DOM construction, script behavior, navigation, or another trust decision. On the server, polluted state may survive into later requests or affect other users in the same process.

That persistence makes server-side testing risky. Prefer local reproduction, or get explicit approval before testing behavior that may outlive your request.

## Common Dead Ends

- the property changes only one normal object;
- the runtime or library rejects dangerous keys;
- no attacker-controlled path reaches the merge;
- the application never reads the polluted property in a useful place.

## Fix Direction

Reject prototype-related keys, use maintained merge utilities, validate input against a schema, and update vulnerable dependencies. For dictionary-style objects, consider structures without inherited prototypes where they fit the application.

## Evidence Ladder

1. Attacker controls a key used by merge or path-set code.
2. A prototype-related key passes validation.
3. A unique harmless inherited property appears.
4. Application behavior reads that property.
5. A security-relevant gadget changes DOM, authorization, configuration, or another boundary.

Report confidence rises with the ladder. Step 3 alone may be valid library behavior or low impact; step 5 explains why the application is vulnerable.

## Practical Review Targets

Search JavaScript for recursive merge helpers, dynamic property paths, query parsers, object cloning, defaults, and configuration objects. Review dependency versions, but prove the vulnerable path is reachable in this application.

## Report Title Pattern

`Prototype pollution in [input path] reaches [security-relevant gadget]`

## Sources and Operations

Review query parsers, JSON input, URL fragments, configuration imports, recursive merges, cloning, deep defaults, and dynamic path setters. Trace attacker control through the exact operation rather than testing every object blindly.

## Dangerous Key Handling

Protection should reject prototype-related keys at every nesting level and after decoding or normalization. A filter in one parser may be bypassed by another representation, but test only representations the application legitimately accepts.

## Client-Side Gadgets

Look for polluted properties read by DOM construction, script loaders, URL builders, sanitizers, feature flags, or security configuration. Use harmless markers until the full data flow is understood.

## Server-Side Risk

Shared process state can affect later requests and users. Do not test persistent server pollution without explicit permission. Prefer a local reproduction using the same library and code path.

## Dependency Findings

A vulnerable package version is a lead. Confirm that the vulnerable function is reachable with attacker-controlled input and that a useful gadget exists in the deployed application.

## Remediation

Use schema validation, reject dangerous keys recursively, prefer safe data structures and maintained libraries, update dependencies, and add regression tests for nested and encoded input.

---

## Chapter Navigation

[Previous: Race Conditions](race-conditions.md) · [Back to README](../README.md) · [Next: Testing 403 Responses](403-testing.md)
