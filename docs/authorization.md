# Authorization and IDOR

IDOR is not an ID format problem. It is a policy problem: the server found an object, but failed to confirm that the current actor could perform that action on it.

## Think in Four Parts

- **Actor:** anonymous visitor, user A, user B, manager, admin, service.
- **Object:** profile, invoice, file, message, organization, API key.
- **Action:** create, read, update, delete, approve, share, export.
- **State:** draft, active, archived, invited, paid, locked.

This model catches more than changing `123` to `124`. It also covers nested IDs, tenant references, filenames, export jobs, and objects selected from request bodies.

## A Reliable Two-Account Test

1. Create similar objects with accounts A and B.
2. Capture a valid request from each account.
3. Replay A's request with B's object reference.
4. Test reads and writes separately.
5. Check references in paths, query strings, JSON, headers, uploads, and background tasks.
6. Sign back into B and verify the real stored state.

For writes, an echoed object ID or success message proves little. The owner-side state is what counts.

## Boundaries Worth Mapping

- one user to another user;
- member to organization admin;
- tenant A to tenant B;
- customer to support or staff;
- active object to archived or deleted object;
- web client to mobile or direct API;
- parent object to nested child object.

## Common Dead Ends

The object may be public by design. Both accounts may share a tenant. A cache may return your own old response. An API may accept a job and reject it later. A response may echo your input without touching stored data.

Rule these out before writing the report.

## Fix Direction

Authorization should happen on the server wherever the object is used. The decision needs the actor, tenant, object, action, and state. Central policy helps, but every entry point still needs coverage and tests.

## Quick Technique Matrix

| Change | Question | Proof |
| :--- | :--- | :--- |
| object ID | Can A reach B's object? | B's controlled field or state crosses boundary |
| parent ID | Is child authorization inherited safely? | child from another controlled parent is exposed |
| tenant ID | Is tenant taken from client input? | cross-tenant controlled object becomes reachable |
| role | Does server enforce privileged function? | normal user completes controlled admin-only action |
| state | Do archived or deleted objects keep policy? | forbidden post-transition action succeeds |
| channel | Do web, mobile, API, and export agree? | weaker path breaks same rule |

## Request Review Tips

Search paths, query strings, JSON, GraphQL variables, headers, filenames, and job payloads for object references. Keep one valid request for A and B. Swap one reference at a time, then verify from the owner account.

## Report Title Pattern

`[Role] can [read/change] [object] owned by another [user/tenant] via [endpoint]`

## Horizontal, Vertical, and Contextual Checks

- **Horizontal:** same role, different owner.
- **Vertical:** lower role attempts higher-role action.
- **Cross-tenant:** actor and object belong to different organizations.
- **Contextual:** actor normally has access, but wrong object state or relationship.

Test these separately. A horizontal result does not prove vertical impact.

## Nested Object Authorization

Check both parent and child references. An endpoint may confirm access to organization A while loading a document ID owned by organization B. Exports, attachments, comments, and audit records often use separate lookups.

## Indirect and Opaque IDs

UUIDs, hashes, slugs, and signed-looking references do not replace policy. Obtain references from your own controlled accounts; do not enumerate random IDs.

## Async Authorization

Imports, exports, notifications, reports, and queued updates should validate actor and object when the job runs. Check whether a job created before role removal still executes afterward.

## Delete and Recovery Paths

Test archive, restore, delete, undelete, transfer, duplicate, share, and revoke with controlled objects. These paths often use policy different from ordinary reads and writes.

## Remediation Tests

After a fix, regression cases should cover user, role, tenant, object state, nested object, alternate channel, and asynchronous execution. Deny-by-default behavior should return no protected fields or side effects.
