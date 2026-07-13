# Evidence and Reporting

A report is not a diary of everything you tried. It is a short argument supported by enough evidence for someone else to reach the same conclusion.

## Evidence Gets Stronger in Steps

1. Status, size, or timing changed.
2. Response content changed.
3. Controlled data was returned to the wrong actor.
4. Controlled state was changed by the wrong actor.
5. The effect persisted or crossed a meaningful trust boundary.

The first two steps are useful leads. They are not impact by themselves.

## Evidence Worth Keeping

- the smallest reproducible request;
- clear labels for two controlled accounts and their roles;
- before-and-after state;
- short, redacted response fragments;
- UTC timestamps or request IDs when they help the team trace logs;
- notes showing why cache, shared access, or expected behavior do not explain the result.

Screenshots help people scan a report, but raw requests and state checks usually make it reproducible.

## Write the Impact You Proved

Separate behavior from consequence. “The endpoint returned 200” describes behavior. “A member of tenant A downloaded a private invoice owned by tenant B” describes a broken boundary and impact.

State required privileges, user interaction, affected scope, and known limits. Honest limits make a report easier to trust.

## Keep the Report Easy to Review

Use the [finding report template](../templates/finding-report.md). Put the broken rule in the opening paragraph. Keep reproduction steps linear. End with fix direction, not a code patch you could not test in the target environment.

## Observation, Finding, and Impact

Keep these sentences separate:

- **Observation:** what the application returned or changed.
- **Finding:** which security rule failed.
- **Impact:** what an attacker could do within proven conditions.

This structure prevents a strange status code from turning into an exaggerated title.

## Build a Reproduction Pack

A reviewer should receive:

1. account and role setup;
2. controlled object setup;
3. one normal request;
4. one unauthorized variation;
5. authoritative before-and-after state;
6. redacted evidence;
7. known limits.

Use raw HTTP where possible. Screenshots are supporting evidence, not the only reproduction material.

## Redaction Rules

Replace sensitive values consistently:

```text
Authorization: Bearer <USER_A_TOKEN>
Cookie: session=<REDACTED>
email: hunter+user-a@example.test
secret: sk_live_ab...9Z
```

Do not blur the object ID when the ID is necessary to reproduce the authorization swap. Explain that it belongs to a controlled account.

## Severity Questions

- What privilege is required?
- Is user interaction required?
- Does impact cross users, roles, or tenants?
- Is confidentiality, integrity, or availability affected?
- Is the effect persistent?
- How many objects or actions are proven affected?
- Which assumptions remain unverified?

Use CVSS only when the program asks for it. Business severity and CVSS are related but not identical.

## Report Quality Checklist

- [ ] Title names boundary and effect.
- [ ] First paragraph states broken rule.
- [ ] Steps begin from reproducible state.
- [ ] Requests are minimal and redacted.
- [ ] Final state is verified.
- [ ] Impact matches evidence.
- [ ] False positives were checked.
- [ ] Fix direction addresses root control.
- [ ] No private data or full secret appears.
