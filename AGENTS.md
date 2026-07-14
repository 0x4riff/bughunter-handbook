# Agent Operating Guide

Use this repository as evidence-led methodology, not a payload catalog.

## Required entry sequence

1. Read [`methodology/00-engagement-gate.md`](methodology/00-engagement-gate.md).
2. Load [`agent-index.json`](agent-index.json).
3. Validate scope against [`schemas/scope.schema.json`](schemas/scope.schema.json).
4. Select playbooks from observed features; never run every playbook blindly.
5. Follow [`agent/state-machine.json`](agent/state-machine.json).
6. Store claims as an evidence graph and score confidence.
7. Emit a finding only when playbook confirmation rules pass.

## Hard rules

- Never test an asset or method without explicit authorization.
- Never use real-user objects when controlled fixtures can prove behavior.
- Never infer impact from status, length, reflection, timing, or version alone.
- Never validate leaked credentials unless program explicitly permits it.
- Never increase concurrency or parser stress beyond written limits.
- Stop on real personal data, instability, out-of-scope redirects, or unexpected financial effects.
- Record uncertainty and missing evidence. `inconclusive` is valid output.

## Machine interfaces

- Playbooks: `playbooks/*.json`
- Schemas: `schemas/*.schema.json`
- State machine: `agent/state-machine.json`
- Confidence: `agent/confidence-model.json`
- Ontology: `ontology/security-ontology.json`
- Mutations: `mutations/catalog.json`
- Evaluations: `evals/cases/*.json`
- Validation: `node scripts/validate-agent-assets.mjs`
