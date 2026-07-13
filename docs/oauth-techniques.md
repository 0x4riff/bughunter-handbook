---
title: "OAuth & OpenID Connect Techniques"
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

# OAuth & OpenID Connect Techniques

## Table of Contents

- [Draw the Flow First](#draw-the-flow-first)
- [Redirect URI Handling](#redirect-uri-handling)
- [State, Nonce, and Browser Session](#state-nonce-and-browser-session)
- [PKCE](#pkce)
- [Issuer and Audience](#issuer-and-audience)
- [Account Linking](#account-linking)
- [Token Lifecycle](#token-lifecycle)
- [Current Baseline](#current-baseline)
- [Flow Checklist](#flow-checklist)
- [Report Title Pattern](#report-title-pattern)
- [Components to Record](#components-to-record)
- [Redirect Validation](#redirect-validation)
- [Login CSRF and Account Confusion](#login-csrf-and-account-confusion)
- [Token Validation](#token-validation)
- [Refresh and Revocation](#refresh-and-revocation)
- [Deprecated Patterns](#deprecated-patterns)
- [Remediation](#remediation)

OAuth testing is mostly relationship testing: client, authorization server, redirect URI, browser session, authorization code, token, issuer, audience, and user consent must stay bound together.

## Draw the Flow First

Capture a complete normal login with a controlled account. Label authorization request, callback, code exchange, token response, user-info request, and application session creation. Redact every code and token in notes.

## Redirect URI Handling

Check whether the authorization server uses exact registered redirect matching. Pay attention to alternate schemes, hosts, ports, paths, duplicate parameters, and application redirect endpoints. Test only redirects you control, and stop before any real token can leave the expected client.

## State, Nonce, and Browser Session

Confirm login attempts use fresh values and that callbacks are bound to the browser session that started them. Missing parameters are clues; practical impact needs a controlled flow showing login confusion, request forgery, or token substitution.

## PKCE

For authorization-code flows, note whether a code challenge is sent and whether the token endpoint requires the matching verifier. Current security guidance applies PKCE broadly, not only to native apps. Never exchange another user's code.

## Issuer and Audience

In multi-provider or multi-tenant login, verify the client accepts tokens only from the expected issuer and for the expected audience. A valid token for another service should not become a session here.

## Account Linking

Linking social login to an existing account deserves its own test. Check reauthentication, verified-email assumptions, unlink behavior, provider changes, and whether an attacker-controlled identity can be attached without proving control of the current account.

## Token Lifecycle

With your own tokens, observe expiry, refresh rotation, logout, password change, scope reduction, and account disablement. Confirm old refresh tokens cannot silently restore access after revocation.

## Current Baseline

RFC 9700, published in January 2025, is OAuth 2.0 Best Current Practice. It recommends stronger redirect protection, PKCE, restricted token privilege, and refresh-token protection while deprecating weaker patterns such as the implicit grant.

## Flow Checklist

- [ ] Exact client and redirect URI identified.
- [ ] Fresh `state` and, for OIDC, `nonce` observed.
- [ ] Authorization code bound with PKCE where applicable.
- [ ] Issuer and audience match expected provider and client.
- [ ] Callback bound to browser session that started login.
- [ ] Account linking requires proof of current account control.
- [ ] Refresh tokens rotate or receive equivalent replay protection.
- [ ] Logout, password change, disablement, and unlink behavior tested with own tokens.

## Report Title Pattern

Describe relationship failure: `OAuth callback accepts [code/token] not bound to [session/client/issuer], causing [controlled impact]`.

## Components to Record

| Component | What must stay bound |
| :--- | :--- |
| client | registered redirect and intended authorization server |
| authorization request | browser session, state, code challenge |
| code | client, redirect URI, PKCE verifier, short lifetime |
| ID token | issuer, audience, nonce, time, signature |
| access token | audience, scope, sender when constrained |
| refresh token | client, user, rotation family or sender |

## Redirect Validation

Compare the exact URI registered and sent. Do not attempt to deliver real codes to third parties. A redirect weakness becomes impactful only when a controlled code or token crosses the intended client boundary.

## Login CSRF and Account Confusion

Use two controlled accounts and separate browser profiles. Confirm callback state is bound to the session that started login, and that account-linking flows require current-account proof.

## Token Validation

With self-issued test sessions, check issuer, audience, expiration, nonce where applicable, and scope. A token valid for another client or resource should not create a session here.

## Refresh and Revocation

Observe refresh rotation, reuse detection, logout, password change, account disablement, and consent revocation. Never test stolen or third-party tokens.

## Deprecated Patterns

RFC 9700 deprecates weaker practices including the implicit grant and recommends broad PKCE use, exact redirect protection, restricted token privilege, and refresh-token replay protection.

## Remediation

Follow current protocol libraries and RFC 9700. Avoid custom token validation, exact-match redirect URIs, bind browser flows, validate issuer and audience, and protect refresh tokens through rotation or sender constraints.

---

## Chapter Navigation

[Previous: Webhooks & Integrations](webhooks-integrations.md) · [Back to README](../README.md) · [Next: Account Takeover Chains](account-takeover-chains.md)
