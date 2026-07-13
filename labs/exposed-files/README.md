# Exposed Files Local Lab

Local-only teaching lab. It uses synthetic records and binds port `8080` to `127.0.0.1`. Do not deploy publicly.

## Run Vulnerable Mode

```bash
docker compose up --build
curl -H "X-Lab-User: A" "http://127.0.0.1:8080/demo?id=B"
```

Expected evidence: synthetic `B-private` crosses to lab user A.

## Run Fixed Mode

Change `LAB_MODE` to `fixed`, rebuild, and repeat. Expected response: `403`.

## Cleanup

```bash
docker compose down --volumes
```
