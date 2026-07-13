# Business Logic State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: submit
    Pending --> Approved: approve
    Pending --> Rejected: reject
    Approved --> Cancelled: cancel
```

## Invariants

- Who may trigger each transition?
- Which transitions are irreversible?
- Which values are server-authoritative?
- What happens on replay, retry, or concurrency?
