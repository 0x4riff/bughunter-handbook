# GraphQL Nested Authorization Lab

Real `/graphql` endpoint exposes nested integration secret when root resolver omits owner policy.

```bash
LAB_MODE=vulnerable docker compose up --build -d
node test.mjs
LAB_MODE=fixed docker compose up --build -d --force-recreate
node test.mjs --fixed
```
