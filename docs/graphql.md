---
title: "GraphQL"
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

# GraphQL

## Table of Contents

- [Learn the Shape of the API](#learn-the-shape-of-the-api)
- [Test Resolver Boundaries](#test-resolver-boundaries)
- [Query Abuse Without Load Testing](#query-abuse-without-load-testing)
- [Fix Direction](#fix-direction)
- [Practical Query Review](#practical-query-review)
- [Report Title Pattern](#report-title-pattern)
- [Capture and Read Operations](#capture-and-read-operations)
- [Global and Nested IDs](#global-and-nested-ids)
- [Mutations](#mutations)
- [Aliases and Batching](#aliases-and-batching)
- [Query Cost and Pagination](#query-cost-and-pagination)
- [Subscriptions and Persisted Queries](#subscriptions-and-persisted-queries)
- [Remediation](#remediation)

GraphQL changes how an API is queried, not the security rules behind it. Every resolver still needs to know who is asking, which object is being loaded, and what action is allowed.

## Learn the Shape of the API

From normal client traffic, note the endpoint, methods, operation names, root queries and mutations, object IDs, custom scalars, pagination style, aliases, batching, persisted queries, and upload paths.

Use introspection only when program rules allow it. Many applications expose enough structure through their own requests and JavaScript bundles.

## Test Resolver Boundaries

1. Capture an operation for controlled account A.
2. Create equivalent data with account B.
3. Change one object or tenant reference.
4. Check nested fields as well as the root resolver.
5. Treat mutations and their side effects as separate tests.
6. Verify the final state from the owner account.

A root query can be protected while a nested resolver loads data by ID without checking ownership.

## Query Abuse Without Load Testing

Review depth, breadth, aliases, batching, pagination limits, expensive fields, and error detail. Keep requests small. Do not turn cost analysis into a denial-of-service test unless the program explicitly permits it.

Introspection, batching, verbose type names, and stack details may be useful clues, but they are not automatically vulnerabilities. Tie the behavior to a broken rule and practical effect.

## Fix Direction

Place authorization in resolvers or a shared policy layer that resolvers consistently call. Add sensible depth or cost limits, bounded pagination, rate controls, and production-safe errors.

## Practical Query Review

Keep operations small and copied from normal client traffic. For each object-returning field, ask who authorizes the root object and who authorizes nested objects. For each mutation, verify both immediate response and final side effect.

| Surface | Check |
| :--- | :--- |
| global IDs | decode only if format is naturally exposed; test ownership |
| nested resolver | swap child or parent from controlled account B |
| aliases | check whether per-operation controls still apply; avoid high volume |
| batching | check authentication and rate accounting at low request count |
| pagination | test bounded limits and cross-tenant result filtering |
| errors | look for secrets, stack data, internal services, and query details |
| mutation input | check server-owned fields and nested object references |

## Report Title Pattern

`GraphQL [resolver/mutation] exposes [controlled object/action] across [boundary]`

## Capture and Read Operations

Name each query or mutation, list variables, and identify which fields return objects. Pretty-print operations from official client traffic. Avoid sending giant introspection or recursive queries to production.

## Global and Nested IDs

Global IDs may encode type and identifier, but decoding them is discovery—not impact. Test ownership with controlled objects. Check nested resolvers where a protected parent returns children loaded through another service.

## Mutations

Review input objects for server-owned properties, nested IDs, tenant references, and optional fields. Confirm owner-visible state after the mutation and after any background processing.

## Aliases and Batching

At low volume, check whether authentication, authorization, and accounting apply per operation. Do not use aliases or batches to create resource exhaustion.

## Query Cost and Pagination

Record maximum page sizes, nested lists, expensive computed fields, and repeated resolver calls. A theoretical expensive query is not enough; avoid measuring impact through load.

## Subscriptions and Persisted Queries

If used by official clients, test subscription authorization at connection and event delivery. For persisted queries, confirm an actor cannot invoke a privileged operation merely by knowing its identifier.

## Remediation

Authorize inside each resolver or consistent policy layer, bind loaders to tenant context, validate mutation schemas, bound depth and cost, enforce pagination, and sanitize production errors.

---

## Chapter Navigation

[Previous: Mobile API Testing](mobile-api-testing.md) · [Back to README](../README.md) · [Next: Webhooks & Integrations](webhooks-integrations.md)
