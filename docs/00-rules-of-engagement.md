# Rules of Engagement

The easiest mistake in bug bounty is starting with the endpoint instead of the program rules. Five minutes spent on scope can save hours of testing the wrong asset.

## Before You Touch the Target

Keep a small scope note beside your proxy:

- exact hostnames, apps, APIs, and account types that are in scope;
- tests the program does not allow;
- automation and rate-limit rules;
- policy URL and the date you checked it;
- accounts and test data you control.

Scope changes. A hostname that was valid last month may not be valid today.

## Three Questions Before Every Test

1. Is this asset in scope?
2. Is this test method allowed?
3. Can I prove the behavior with my own accounts and data?

If one answer is unclear, pause and ask the program. A clever test is not worth creating an incident.

## Keep the Proof Small

Start read-only. Use one or two controlled records instead of enumeration. Do not create persistence, interrupt service, touch payment flows, or collect real user data when your own data can prove the same issue.

Race conditions, server-side prototype pollution, and tests that trigger background jobs deserve extra care. They can leave effects after the request ends. Use a local reproduction or get approval when the risk is not obvious.

## Handle Evidence Like It Matters

Save only what the report needs. Redact session tokens, passwords, personal information, and unrelated response fields. If a response unexpectedly exposes sensitive data, stop collecting and tell the program what happened.

Permission sets the boundary. Curiosity does not move it.

## Turn Policy into a Test Plan

Copy the rules into a private worksheet before opening a proxy. Separate them into four columns:

| Item | Example | Decision |
| :--- | :--- | :--- |
| asset | `api.example.test` | in scope |
| method | account enumeration | prohibited |
| limit | five requests per second | configure tooling |
| contact | security team address | use if test becomes risky |

Do not infer that a parent domain includes every subdomain. Mobile apps, third-party services, acquired brands, and cloud buckets may have separate rules.

## Accounts and Test Data

Use descriptive labels such as `USER_A`, `USER_B`, `ORG_A_ADMIN`, and `ORG_B_MEMBER`. Create unique records that are easy to recognize and safe to expose to your other controlled account.

Keep authentication material out of screenshots and repositories. Use a password manager or temporary local environment variables. Destroy test data when the program expects cleanup.

## Automation Guardrails

Before running a tool:

1. calculate how many requests the input creates;
2. set an explicit rate and thread count;
3. remove out-of-scope redirects and hosts;
4. start with a tiny sample;
5. inspect responses before expanding;
6. stop on errors, throttling, or service instability.

“Low rate” depends on the program. Its written limit wins.

## When to Stop and Contact the Program

Stop if you encounter production credentials, real personal data, payment effects, internal administrative access, an ability to alter another user's state, or unexpected service degradation. Preserve minimal evidence and explain what was accessed before asking for validation guidance.

## Evidence Hygiene

Use a consistent evidence folder per finding:

```text
finding-name/
  scope-note.md
  request-redacted.txt
  response-redacted.txt
  before.png
  after.png
  timeline.md
```

Never commit raw session cookies, authorization headers, private source, or user records.

## Pre-Test Checklist

- [ ] Asset and exact hostname confirmed.
- [ ] Policy checked today.
- [ ] Technique allowed.
- [ ] Rate configured.
- [ ] Controlled accounts ready.
- [ ] Test data contains no real user information.
- [ ] Stop condition written down.
- [ ] Evidence storage is private.
