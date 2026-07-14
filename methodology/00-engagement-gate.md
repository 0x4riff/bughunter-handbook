# Engagement Gate

No testing starts until asset, method, accounts, rate, prohibited actions, and stop conditions are explicit. Unknown scope means `BLOCKED_SCOPE`, not permission.

Required gate record:

```json
{"asset":"api.example.test","authorization":"written","allowed_methods":["manual-http"],"rate_limit_rps":2,"controlled_accounts":["USER_A","USER_B"],"prohibited":["real-user-access","availability-testing"]}
```

Stop immediately on real personal data, active production secrets, financial side effects, instability, or redirection to an unauthorized host.
