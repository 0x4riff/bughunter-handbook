# Field Tips & Tricks

Small habits often find more bugs than large wordlists. These are the habits I keep close while testing.

## Keep a “Why?” Column

For every interesting request, write why the parameter exists. `account_id` may select data, `return_url` may control navigation, and `fields` may shape a response. Purpose suggests the security rule worth testing.

## Compare Roles, Not Only Users

Two normal users catch horizontal authorization bugs. Add a different role, tenant, and object state to catch vertical and workflow bugs. A useful matrix is usually small: actor, object owner, action, state, expected result, actual result.

## Let Official Clients Teach You

Browser and mobile traffic reveal real routes, operation names, headers, feature flags, and object relationships. Capture a clean action first. Guessing comes later.

## Save One Known-Good Request

Keep an untouched baseline beside every modified request. When cookies expire or a feature changes, the baseline tells you whether the target changed or your test broke.

## Read Responses Side by Side

Ignore changing timestamps and request IDs. Compare stable fields, object ownership, side effects, and final state. A different byte count is a lead; a private field or unauthorized state change is evidence.

## Test Transitions, Not Just Pages

Interesting checks often sit between states: invite to member, draft to published, unpaid to paid, active to deleted, password changed to old sessions revoked. Ask what should become impossible after each transition.

## Revisit Features Through Another Channel

Web, mobile, REST, GraphQL, export, and background jobs may reach the same object through different code. Do not assume one successful check protects every path.

## Use Unique Markers

A marker such as `BH_<feature>_<short-id>` makes reflections, asynchronous jobs, emails, and stored data easier to trace without using dangerous payloads.

## Keep a Dead-End Log

Record why a lead failed: public object, shared tenant, cache, echo only, job rejected later. This stops repeated work and sharpens future triage.

## Stop When Proof Is Complete

One controlled object crossing one clear boundary usually beats a dump of records. Strong reports are small enough to understand.

## Proxy Organization

Use a project per program. Tag requests by feature and account. Keep separate cookie jars or browser profiles for controlled users so account A does not silently become account B.

Useful request labels:

```text
AUTH-A-BASELINE
AUTH-B-DENIED
OBJECT-B-READ
OBJECT-B-WRITE
OWNER-B-VERIFY
```

## Endpoint Mining Without Blind Guessing

Collect routes from normal traffic, JavaScript source maps when public, API documentation, mobile traffic when allowed, error messages, and links returned by the application. Group endpoints by object and action rather than dumping every URL into one list.

## Difference Testing

Normalize volatile values before comparing responses: timestamps, request IDs, CSRF tokens, signatures, and random ordering. Then compare stable fields and application state.

```bash
jq -S 'del(.request_id,.timestamp)' response-a.json > a.normalized.json
jq -S 'del(.request_id,.timestamp)' response-b.json > b.normalized.json
diff -u a.normalized.json b.normalized.json
```

## Retest After State Changes

Repeat meaningful checks after logout, password change, role removal, tenant transfer, object archive, ownership change, and feature disablement. Old sessions and background jobs often keep stale authorization assumptions.

## Time Management

Use three queues:

- **Now:** one safe request can confirm or reject the lead;
- **Later:** needs setup, another role, or deeper mapping;
- **Stop:** out of scope, duplicate behavior, or no plausible boundary.

A disciplined stop queue is as valuable as a payload list.

## Reporting Habit

Draft the title and impact sentence before deeper testing. If you cannot name the broken boundary, gather more context rather than more payloads.
