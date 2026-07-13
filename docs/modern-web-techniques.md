---
title: "Modern Web Techniques"
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

# Modern Web Techniques

## Table of Contents

- [Web Cache Deception and Cache Keys](#web-cache-deception-and-cache-keys)
- [Webhooks and URL Fetchers](#webhooks-and-url-fetchers)
- [File Upload Pipelines](#file-upload-pipelines)
- [Client-Side Trust Boundaries](#client-side-trust-boundaries)
- [AI-Enabled Features](#ai-enabled-features)
- [Third-Party API Trust](#third-party-api-trust)
- [Modern Surface Checklist](#modern-surface-checklist)
- [Evidence Rule](#evidence-rule)
- [Cache Investigation](#cache-investigation)
- [SSRF and URL Fetchers](#ssrf-and-url-fetchers)
- [File Uploads](#file-uploads)
- [Browser Messaging](#browser-messaging)
- [AI Features](#ai-features)
- [Remediation](#remediation)

Some useful bug classes sit between application code, proxies, caches, and browser features. They need architecture-aware testing, not generic payload spraying.

## Web Cache Deception and Cache Keys

First learn what is cached, for whom, and which request parts affect the cache key. Use a controlled page containing a unique harmless marker. Check whether personalized content can be stored under a URL another unauthenticated browser can request. Never test with real user pages.

Treat `Age`, `X-Cache`, and timing as clues. The proof is controlled private content crossing sessions.

## Webhooks and URL Fetchers

Map features that fetch URLs: webhooks, link previews, imports, image proxies, PDF generation, and integrations. Use a domain or collaboration service you control. Check URL parsing, redirects, DNS changes, protocol restrictions, response handling, and whether fetched content reaches another parser.

Do not target internal addresses, cloud metadata, or third-party systems unless rules explicitly allow it. An outbound callback proves fetching; it does not automatically prove access to internal data.

## File Upload Pipelines

Follow the whole lifecycle: validation, storage, preview, transformation, download, sharing, and deletion. Compare filename, extension, declared content type, detected type, and the final content-disposition behavior. Use inert files and controlled accounts.

## Client-Side Trust Boundaries

Review `postMessage`, service workers, browser storage, URL fragments, and cross-window communication. For `postMessage`, check both sender-origin validation and receiver targeting. A message listener is a lead until attacker-controlled data reaches a useful action or sink.

## AI-Enabled Features

Treat model output as untrusted data. Map prompt inputs, retrieved documents, tool calls, generated links, rendered Markdown or HTML, and actions requiring confirmation. Test only with controlled documents and accounts. A model repeating instructions is not enough; show a real authorization, data, or action boundary failure.

## Third-Party API Trust

Applications may validate direct user input but trust data returned by integrations. Trace imported names, URLs, files, webhook fields, and status values into later templates, jobs, and decisions. Keep the third-party side under your control.

## Modern Surface Checklist

- [ ] Personalized responses checked for cache behavior using controlled markers.
- [ ] URL-fetch features mapped with controlled callback infrastructure.
- [ ] Upload validation followed through storage, transform, preview, and download.
- [ ] `postMessage` sender and receiver origins reviewed.
- [ ] Service-worker scope and cached private responses reviewed.
- [ ] AI output treated as untrusted before HTML, tools, or privileged actions.
- [ ] Third-party API data traced into templates, jobs, and decisions.

## Evidence Rule

Architecture signals are not impact. A cache header, outbound callback, message listener, or model response becomes reportable when controlled data or action crosses a security boundary.

## Cache Investigation

Use unique content in your own account. Capture cache-related headers, vary one request component, then request from a clean unauthenticated session. Do not place sensitive real-user pages into shared caches.

Check path extensions, delimiters, query parameters, headers, and normalization only when they affect routing or cache keys. The proof is controlled private content crossing sessions.

## SSRF and URL Fetchers

Begin with a controlled callback domain. Record protocol, DNS, redirects, method, headers, and whether response content is processed. An outbound request confirms a fetch; internal access requires separate allowed proof.

## File Uploads

Track filename, detected type, storage location, transformed copies, preview behavior, content disposition, sharing, and deletion. Use inert files. Avoid executable or polyglot content on production unless explicitly permitted.

## Browser Messaging

For `postMessage`, identify sender, receiver, target origin, origin validation, message schema, and resulting action. Check service-worker scope, cache handling, and whether private responses remain available after logout.

## AI Features

Map prompt sources, retrieval data, rendered output, tool permissions, confirmation gates, and audit trail. Test prompt injection with controlled documents. A model following text is expected behavior unless it causes unauthorized data access or action.

## Remediation

Align cache and origin normalization, restrict URL fetch destinations and protocols, validate uploads by content and use, enforce browser origin checks, and keep AI tool authorization outside model decisions.

---

## Chapter Navigation

[Previous: Software Supply-Chain Exposure](supply-chain-exposure.md) · [Back to README](../README.md) · [Next: References & Further Study](references.md)
