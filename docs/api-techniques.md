# API Testing Techniques

Modern APIs expose more than object IDs. Test authorization at object, property, function, and workflow level.

## Build an Endpoint Inventory

Capture routes used by official clients. Group them by version, role, object, and action. Watch for old versions, mobile-only routes, debug operations, exports, webhooks, and endpoints present in JavaScript but absent from public docs.

## Object-Level Checks

Use two controlled accounts. Replace one object reference at a time, including nested IDs and IDs inside JSON arrays. Verify returned data or final state from the owner account.

## Property-Level Checks

Compare fields returned to different roles. For writes, remove optional fields, add fields seen in read responses, and check whether server-owned properties such as role, owner, status, quota, or price are accepted. Use harmless controlled values; never assign real privileges or value.

## Function-Level Checks

Map actions available to each role. Check whether a normal client can call staff, moderation, export, approval, or organization-management functions found in normal traffic or client code. A hidden button is not enforcement.

## Pagination and Filters

Check whether filters narrow results after authorization rather than before it. Compare `limit`, cursors, sort order, date ranges, field selectors, and export endpoints with controlled data. Do not turn limit testing into resource exhaustion.

## Content-Type and Parser Differences

When scope permits, compare request formats the application already supports, such as JSON and form data. Different parsers may apply different validation. Change format, not meaning, and avoid parser stress tests.

## Async and Bulk Operations

A synchronous endpoint may reject an action while an import, bulk edit, export, or queued job accepts it. Verify completion state, not the initial “accepted” response.

## Sensitive Business Flows

Look beyond technical rate limits. Invitations, coupon claims, password resets, ticket purchases, comments, and verification messages can be abused at low request volume. Use controlled recipients and respect automation limits.

## Resource Consumption

Identify user-controlled page size, upload size, query cost, report generation, and paid external actions such as email or SMS. Document the cost boundary. Do not prove it by causing load or charges without explicit approval.

## Fast Endpoint Checklist

- [ ] Two controlled users and, where possible, two tenants.
- [ ] Normal read, write, delete, export, and privileged actions captured.
- [ ] Object IDs checked in path, query, body, nested JSON, and job data.
- [ ] Server-owned properties compared by role.
- [ ] Old API versions and official mobile routes reviewed.
- [ ] Bulk and asynchronous completion state verified.
- [ ] Pagination and field selectors checked without creating load.
- [ ] Error behavior checked for useful disclosure, not status alone.

## Report Title Pattern

Name boundary and effect: `[Actor] can [action] [controlled object/property/function] across [user/tenant/role] boundary`.

## Discovery Sources

Use official client traffic, OpenAPI documents exposed by the application, JavaScript bundles, mobile schemas when allowed, error responses, SDKs, and links in API responses. Record host, version, method, authentication type, content type, object, and role.

## Authentication Tests

With your own accounts, review token location, expiry, logout, refresh, session-to-token exchange, API keys, and whether disabled users retain access. Do not brute-force credentials or tokens.

## Authorization Layers

- **Object level:** may this actor reach this record?
- **Property level:** may this actor read or set this field?
- **Function level:** may this role call this operation?
- **Tenant level:** does every referenced object belong to the active tenant?
- **Workflow level:** is the action valid in current state?

## Mass Assignment Review

Start from a normal write body. Compare it with fields returned by reads and fields used by higher roles. Add one harmless server-owned field at a time. Confirm final stored state; echoed JSON is not proof.

## Version and Inventory Drift

Compare current and older versions used by official clients. Look for retired endpoints, debug operations, forgotten hosts, and inconsistent policy. Do not probe unrelated guessed infrastructure.

## Error and Schema Disclosure

Errors may reveal object types, internal paths, SQL fragments, service names, or validation rules. Report disclosure only when sensitive enough on its own or useful in a proven chain.

## Remediation

Maintain an API inventory, retire old versions, validate schemas, enforce policy centrally at every object and property access, bound expensive operations, and treat third-party API data as untrusted.
