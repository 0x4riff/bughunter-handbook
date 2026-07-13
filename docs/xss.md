# Cross-Site Scripting

XSS testing gets noisy when it starts with payloads. Start with data flow instead: where can you place input, where does it appear, and how does the browser parse that location?

## Follow the Input

Possible sources include URLs, forms, APIs, uploads, profiles, messages, and integrations. Possible destinations include HTML text, attributes, script blocks, JavaScript strings, URL handlers, and DOM APIs.

Each destination needs different handling. A value safely encoded for HTML text may still be unsafe inside JavaScript.

## A Calm Testing Loop

1. Submit a unique inert marker such as `BH_TEST_7F3A`.
2. Search for that marker in the response and rendered DOM.
3. Identify its exact parsing context.
4. Check what encoding or sanitization changed it.
5. Build the smallest proof on a page and account you control.
6. If stored behavior matters, confirm that a second controlled account can reach the view.

## DOM XSS

Look for attacker-controlled sources reaching sinks such as `innerHTML`, `outerHTML`, `insertAdjacentHTML`, unsafe URL navigation, or string-based code execution. Finding a sink is only half the work. You still need controllable flow and a browser context that can create a security effect.

## Things That Look Better Than They Are

- reflection that is correctly encoded;
- a marker inside JSON served with a safe content type;
- execution caused only by a local browser extension or debugging tool;
- broken markup with no script or meaningful browser action;
- a theoretical sink that the attacker cannot reach.

Treat Content Security Policy as defense in depth. Describe what it blocks, but do not claim a bypass unless you can reproduce one.

## Fix Direction

Prefer safe DOM APIs and context-aware output encoding. When rich HTML is required, use a maintained sanitizer with a narrow policy. A strong CSP reduces damage when another control fails.

## Context Cheat Sheet

| Marker lands in | Main question | Safer first check |
| :--- | :--- | :--- |
| HTML text | Is `<` encoded? | inspect raw response and DOM |
| quoted attribute | Are quote and context encoded? | observe parser result with inert delimiters |
| URL attribute | Which schemes and destinations are allowed? | use controlled HTTPS URL |
| JavaScript string | Is data serialized for JavaScript? | inspect escaping without executing code |
| DOM sink | Can attacker input reach it? | trace source to sink with unique marker |
| stored rich text | Which users render it? | second controlled account |

## Triage Sequence

```text
reflection -> parsing context -> controllable breakout -> execution -> victim reach -> impact
```

Do not skip from reflection to “stored XSS.” Prove each link with the smallest controlled demonstration.

## Report Title Pattern

`Stored XSS in [feature] executes when [controlled victim role] views [page]`

## Sources to Map

Include query and path values, fragments, form fields, headers rendered into pages, profile data, rich text, filenames, SVG or document metadata, API content, integration data, and cross-window messages.

## Context Matters

Inspect raw response and live DOM. Browser parsing can move or repair markup. Determine whether data lands in HTML text, an attribute, a URL, JavaScript, CSS, SVG, or a DOM sink before selecting a proof.

## Stored and Second-Order Paths

Track where input is saved and which roles later render it: support dashboards, admin review, exports, emails, notifications, PDF previews, and moderation tools. Use only controlled recipient accounts.

## DOM Data Flow

Trace source to transformation to sink. Search for `innerHTML`, `outerHTML`, `insertAdjacentHTML`, document writes, string-based execution, dangerous URL assignment, and unsafe template rendering. A sink without attacker control is not a finding.

## Browser Controls

Record CSP, Trusted Types, sandboxing, cookie flags, and frame restrictions. These may reduce impact or block a path. Do not claim bypass unless reproduced.

## Impact Proof

Use a minimal visible effect or controlled callback only when allowed. Avoid stealing cookies, tokens, or user data. Explain victim role, interaction, origin, persistence, and reachable action.

## Remediation

Encode for exact output context, use safe DOM APIs, sanitize rich HTML with a maintained library, validate URLs, adopt Trusted Types where practical, and deploy CSP as defense in depth.
