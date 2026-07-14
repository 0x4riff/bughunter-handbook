# Exposed Development Files Lab

Lab distinguishes real `.env`, sample `.env.example`, Git signature, and `200` soft 404.

```bash
LAB_MODE=vulnerable docker compose up --build -d
node test.mjs
LAB_MODE=fixed docker compose up --build -d --force-recreate
node test.mjs --fixed
```
