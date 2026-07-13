---
title: "References & Further Study"
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

# References & Further Study

## Table of Contents

- [Standards and Guides](#standards-and-guides)
- [How to Use References](#how-to-use-references)
- [Coverage Map](#coverage-map)
- [Additional Primary Resources](#additional-primary-resources)
- [Source Discipline](#source-discipline)
- [Practice Safely](#practice-safely)

This handbook uses original wording and focuses on practical field use. These primary resources are useful for deeper study and keeping techniques current.

## Standards and Guides

- [OWASP Web Security Testing Guide — latest](https://owasp.org/www-project-web-security-testing-guide/latest/)
- [OWASP API Security Top 10 — 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [PortSwigger Web Security Academy topics](https://portswigger.net/web-security/all-topics)
- [RFC 9700: Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

## How to Use References

Prefer standards for protocol behavior, maintained testing guides for coverage, and labs for practice. Check publication dates. A technique can remain useful while its recommended mitigation changes.

Never copy a lab attack into a live program without checking scope, rate limits, and side effects.

## Coverage Map

| Topic | Primary starting point |
| :--- | :--- |
| general web testing | OWASP Web Security Testing Guide |
| API authorization and abuse | OWASP API Security Top 10 2023 |
| practical labs | PortSwigger Web Security Academy |
| OAuth and OpenID Connect | RFC 9700 and OpenID specifications |
| weakness terminology | MITRE CWE |
| severity calculation | FIRST CVSS |

## Additional Primary Resources

- [MITRE CWE](https://cwe.mitre.org/)
- [FIRST CVSS v4.0](https://www.first.org/cvss/v4.0/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)

## Source Discipline

Prefer protocol specifications and maintained project documentation over copied payload collections. Record version and publication date when advice changes over time. Treat blog posts and conference research as leads until the behavior is reproduced in an authorized lab or controlled target.

## Practice Safely

Use labs for destructive, high-volume, parser-stress, cache-poisoning, request-smuggling, and server-persistence techniques before considering any production test. A lab technique does not override a program's rules.

---

## Chapter Navigation

[Previous: Modern Web Techniques](modern-web-techniques.md) · [Back to README](../README.md) · [README](../README.md)
