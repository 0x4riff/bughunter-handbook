---
title: "Testing 403 Responses"
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

# Testing 403 Responses

## Table of Contents

- [Investigate the Boundary](#investigate-the-boundary)
- [What Makes It a Finding](#what-makes-it-a-finding)
- [Frequent False Positives](#frequent-false-positives)
- [Signal Versus Noise](#signal-versus-noise)
- [Practical Tip](#practical-tip)
- [Report Title Pattern](#report-title-pattern)
- [Map the Denial Layer](#map-the-denial-layer)
- [Evidence-Led Variations](#evidence-led-variations)
- [Validate a Read Bypass](#validate-a-read-bypass)
- [Validate a Write Bypass](#validate-a-write-bypass)
- [Remediation](#remediation)

A 403 is a refusal, not a challenge to make the status code disappear. The useful question is whether an unauthorized actor can reach protected data or trigger a protected action.

## Investigate the Boundary

1. Confirm the host and path are in scope.
2. Capture normal behavior for an allowed role and a denied role.
3. Review routes, API versions, and request shapes used by official clients.
4. Compare response content and final state, not only status.
5. Test the same security rule with controlled accounts.

Path mutations, alternate headers, and encoding changes can expose routing differences. They can also produce endless proxy noise. Use them only when scope permits and you have a reason tied to the target's architecture.

## What Makes It a Finding

You need repeatable access to protected content or a protected action. Report the missing access check and affected boundary. “403 bypass” is a technique label, not an impact statement.

## Frequent False Positives

- a custom error page returns 200;
- CDN and origin format errors differently;
- a redirect ends at the login page;
- input is echoed and changes response size;
- an alternate path reaches only public content.

If the protected object or action never becomes available, keep it as a lead and move on.

## Signal Versus Noise

| Observation | What it may mean | What to verify |
| :--- | :--- | :--- |
| `200` with error body | custom status handling | protected content absent |
| different length | echo, proxy page, localization | stable sensitive fields |
| redirect | login or canonical path | final destination and session state |
| alternate route works | public alias or missing policy | same protected object/action |
| write says success | queued or fake response | owner-visible final state |

## Practical Tip

Capture an authorized response first. Define two or three stable markers that only protected content contains. Compare those markers and final state, not status code alone.

## Report Title Pattern

`Missing authorization on [alternate route] exposes [object/action] to [role]`

## Map the Denial Layer

A denial may come from CDN, WAF, reverse proxy, application router, authentication middleware, or object policy. Compare headers, body templates, request IDs, and behavior for known public and protected paths. Do not assume every `403` comes from the application.

## Evidence-Led Variations

Use variations only when architecture suggests them:

- official API version or route used by another client;
- canonical versus trailing-slash route;
- documented method used by the feature;
- reverse-proxy and application path normalization difference;
- alternate object action such as export or download;
- background or bulk version of the same protected action.

Avoid giant header and encoding lists. They create noise and may trigger defenses without testing a clear rule.

## Validate a Read Bypass

Compare protected markers from an authorized baseline. A valid result returns the same controlled private object to the unauthorized actor, not merely a similar page.

## Validate a Write Bypass

Use a harmless controlled change, then sign in as the owner and verify stored state. Check whether a worker later rolls the change back.

## Remediation

Normalize the request once, then apply authentication and authorization to the normalized route. Keep edge and origin routing rules aligned. Test alternate methods, versions, downloads, and async paths in policy regression tests.

---

## Chapter Navigation

[Previous: Prototype Pollution](prototype-pollution.md) · [Back to README](../README.md) · [Next: Exposed and Backup Files](exposed-files.md)
