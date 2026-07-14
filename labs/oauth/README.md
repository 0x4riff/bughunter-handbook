# OAuth Callback-Binding Lab

Two synthetic browser profiles demonstrate login CSRF caused by missing `state`-to-session binding.

```bash
LAB_MODE=vulnerable docker compose up --build -d
node test.mjs
LAB_MODE=fixed docker compose up --build -d --force-recreate
node test.mjs --fixed
```
