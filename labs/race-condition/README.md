# Race-Condition Lab

Two requests race a single-use redemption. Vulnerable mode performs check-then-write; fixed mode commits once.

```bash
LAB_MODE=vulnerable docker compose up --build -d
node test.mjs
LAB_MODE=fixed docker compose up --build -d --force-recreate
node test.mjs --fixed
```
