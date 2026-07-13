# Business Logic

Business-logic bugs live in the gap between what an endpoint accepts and what the product is supposed to allow. They often look ordinary at the HTTP layer.

## Draw the Workflow

Write the states in order:

`draft -> submitted -> approved -> fulfilled -> refunded`

For each move, note who can trigger it, what must already be true, which value changes, whether a token is single-use, and which external side effects occur.

## Questions That Find Useful Edges

- Can a required step be skipped?
- Can a one-time action be replayed?
- What happens when requests arrive out of order?
- Does the server trust client price, quantity, currency, owner, or destination?
- Do old links and tokens still work after state changes?
- Does switching between web, mobile, and API change enforcement?
- Can two controlled requests win the same transition?
- Do cancellation, refund, invitation, and recovery paths follow the same rules?

## Prove the Final State

A success response is not enough. Check the order, ledger, quota, role, balance, email, or owner-visible state. Use low-value controlled objects and stop before a test can affect inventory, money, or other users.

Race tests can create load or duplicate side effects. Follow program limits and ask before increasing concurrency.

## Fix Direction

Keep important invariants on the server. Use atomic state transitions, authoritative values, and idempotency for operations that should happen once. Validate both the requested transition and the object's current state.

## Workflow Test Matrix

| Technique | Example question | State to verify |
| :--- | :--- | :--- |
| skip | Can approval be bypassed? | final object status |
| replay | Can one-time benefit run twice? | ledger, quota, redemption count |
| reorder | Can refund happen before settlement? | order and payment state |
| stale action | Does old invite work after revoke? | membership state |
| cross-channel | Does API enforce same rule as UI? | authoritative backend state |
| value trust | Can client set price, owner, or role? | server-stored value |
| parallel action | Can two transitions both win? | count and audit log |

## Practical Tip

Capture every request in one normal workflow, then label which request changes authoritative state. Those transition requests deserve more attention than page-load traffic.

## Report Title Pattern

`[Workflow invariant] can be bypassed by [replay/reordering/state manipulation]`

## Identify Invariants

An invariant is a rule that must remain true regardless of request order or client behavior:

- total refund cannot exceed captured payment;
- invitation cannot grant a role higher than inviter may assign;
- one-time token cannot be consumed twice;
- inventory cannot drop below zero;
- verified identity cannot change without re-verification.

Write invariants before test cases.

## Value Sources

For price, role, owner, discount, currency, quantity, and destination, ask which system is authoritative. Change one client value using low-value controlled data and verify what the server stores or charges.

## Failure and Recovery Paths

Interrupt workflows at safe points: close browser, let token expire, cancel, retry, or switch channels. Check whether partial state creates a shortcut or leaves a reusable action.

## Role and Approval Chains

Test self-approval, approval after role removal, duplicate approval, lower-role assignment, and object transfer between controlled tenants. Do not grant or retain real administrative access.

## Reporting

Describe the invariant, exact transition sequence, authoritative final state, and measurable effect. “Business logic issue” is too broad for a useful title.
