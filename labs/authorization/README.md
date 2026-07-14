# Authorization Lab

Real scenario: object-level authorization on `GET /documents/:id`.

```bash
LAB_MODE=vulnerable docker compose up --build -d
curl -H "X-Lab-User: USER_A" http://127.0.0.1:8080/documents/B
node test.mjs
LAB_MODE=fixed docker compose up --build -d --force-recreate
node test.mjs --fixed
```

Expected vulnerable evidence: `USER_A` receives controlled `B-private`. Fixed mode returns `403`.
