# Evidence Graph

A finding is a claim connected to scope, controlled ownership, baseline, mutated exchange, authoritative effect, false-positive checks, and cleanup. Orphan claims fail validation.

```mermaid
flowchart LR
 S[Scope] --> C[Claim]
 O[Controlled ownership] --> C
 B[Baseline] --> C
 M[Mutated request] --> C
 F[Final state] --> C
 A[Alternatives checked] --> C
 C --> R[Redacted report]
```

Evidence files stay private. Commit only synthetic examples and hashes.
