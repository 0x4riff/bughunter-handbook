---
title: "Exposed Development Files"
difficulty: intermediate
estimated_time: "30 minutes"
prerequisites:
  - HTTP basics
  - authorized test environment
last_reviewed: "2026-07"
standards:
  - OWASP WSTG
  - MITRE CWE
---

# Exposed Development Files

## Table of Contents

- [What May Leak](#what-may-leak)
- [Where to Look](#where-to-look)
- [Establish a Real Baseline](#establish-a-real-baseline)
- [Small Targeted Discovery](#small-targeted-discovery)
- [Safe Secret Triage](#safe-secret-triage)
- [Git Exposure: Proving the Right Thing](#git-exposure-proving-the-right-thing)
- [Artifact-by-Artifact Triage](#artifact-by-artifact-triage)
- [Chaining Without Overreaching](#chaining-without-overreaching)
- [False Positives](#false-positives)
- [Report Checklist](#report-checklist)
- [Report Skeleton](#report-skeleton)
- [Remediation](#remediation)
- [Hunter's Summary](#hunters-summary)

Development artifacts sometimes reach a public web root with the application. Useful findings come from the information inside them—not from a `200`, `403`, or interesting filename.

> Use these checks only on in-scope hosts. Keep request rates within program rules. If a file exposes real user data or a live secret, stop collecting, redact evidence, and report it.

## What May Leak

- source code and commit history;
- environment variables and signing secrets;
- cloud, database, email, or payment credentials;
- private repository URLs;
- internal hosts, ports, paths, and service names;
- debug arguments and deployment commands;
- developer usernames and local directory structure;
- old application versions and removed endpoints.

## Where to Look

Check in-scope production, staging, development, QA, old, preview, and static hosts. Forgotten environments often have weaker deployment controls than the main site.

Start with paths supported by technology or deployment evidence. Avoid large generic scans when a small targeted list will do.

### Environment Files

```text
.env
.env.local
.env.development
.env.production
.env.staging
.env.test
.env.backup
.env.bak
.env.old
.env.example
```

An `.env.example` is often intentional and harmless. It matters only when it contains real values or sensitive internal details.

### Git Metadata

```text
.git/HEAD
.git/config
.git/index
.git/logs/HEAD
.git/packed-refs
.git/refs/heads/main
.git/refs/heads/master
```

`HEAD` can confirm Git metadata. `config` may reveal a remote. An accessible `index` or object store may make source reconstruction possible. A directory returning `403` proves neither exposure nor impact.

### Editor and IDE Files

```text
.vscode/settings.json
.vscode/launch.json
.vscode/tasks.json
.vscode/extensions.json
.idea/workspace.xml
.idea/dataSources.xml
.idea/dataSources.local.xml
.idea/webServers.xml
.idea/deployment.xml
.idea/vcs.xml
```

Formatting settings and extension recommendations are usually low value. Debug environments, database connections, deployment mappings, credentials, and private remotes deserve closer review.

### OS, Build, and Package Artifacts

```text
.DS_Store
Thumbs.db
npm-debug.log
yarn-error.log
composer.lock
package-lock.json
pnpm-lock.yaml
Gemfile.lock
Pipfile.lock
poetry.lock
Dockerfile
docker-compose.yml
Makefile
```

Lockfiles and build files are not automatically sensitive. They become useful when they reveal private package sources, credentials, internal services, unsupported components, or deployment behavior that creates impact.

### Framework and Cloud Artifacts

```text
application.properties
application.yml
application.yaml
appsettings.json
appsettings.Production.json
config.php
wp-config.php.bak
settings.py
local.settings.json
firebase.json
.firebaserc
serverless.yml
samconfig.toml
terraform.tfstate
terraform.tfstate.backup
```

Use framework knowledge to narrow checks. State files and production configuration can be highly sensitive; stop after enough redacted evidence exists.

## Establish a Real Baseline

Before scanning, request two or three random paths that should not exist. Record status, length, title, content type, redirect destination, and a stable body hash. This exposes soft 404s and catch-all routing.

```bash
curl -sS -D baseline.headers https://target.example/not-real-bh-7f3a \
  -o baseline.body
sha256sum baseline.body
```

For each candidate, compare content—not only status:

```bash
curl -sS -D candidate.headers https://target.example/.git/HEAD \
  -o candidate.body
file candidate.body
wc -c candidate.body
```

Expected signatures help:

- Git `HEAD`: commonly starts with `ref: refs/heads/` or contains a commit ID;
- Git config: INI-like sections such as `[core]` or `[remote "origin"]`;
- environment file: key-value pairs, not an HTML error template;
- JSON editor config: parseable JSON with relevant settings;
- XML project file: expected IDE elements, not a proxy block page.

## Small Targeted Discovery

Create `wordlists/dev-files.txt` from this repository, then use a rate allowed by the program:

```bash
ffuf -u https://target.example/FUZZ \
  -w wordlists/dev-files.txt \
  -mc 200,206,301,302,307,308,401,403 \
  -rate 5
```

Calibrate filters against known missing paths. Do not copy a response-size filter from another host; soft 404 templates vary.

Useful follow-up questions:

- Does a redirect lead to the real file, login, or generic home page?
- Does `Range` return file bytes when a normal request is blocked?
- Do `HEAD` and `GET` differ because of normal server behavior?
- Is the same artifact exposed on another in-scope environment?
- Is the content generated for this request, cached, or truly stored?

Do not use method or range differences to bypass an explicit program restriction.

## Safe Secret Triage

Search a downloaded controlled artifact locally. Prefer tools that redact values in output.

```bash
rg -n -i \
  'api[_-]?key|client[_-]?secret|private[_-]?key|password|passwd|token|authorization|database[_-]?url|aws_access_key_id|webhook|internal|staging|debug' \
  evidence/
```

Classify each match:

1. **Placeholder:** `CHANGEME`, sample value, documentation.
2. **Public identifier:** analytics ID, publishable payment key, public Firebase config.
3. **Sensitive but unverified:** secret-shaped value with no safe validity proof.
4. **Active secret:** confirmed only through a program-approved, non-destructive check.
5. **User or production data:** stop immediately and report.

Never paste full secrets into an issue. Show a short prefix and suffix only when needed to prove two values match.

## Git Exposure: Proving the Right Thing

Use increasing evidence levels:

1. `.git/HEAD` has a valid Git reference.
2. `.git/config` or refs expose repository metadata.
3. `index` or object files are accessible.
4. A controlled local reconstruction succeeds.
5. Reconstructed history contains non-public source or removed sensitive material.

Reconstruction downloads many files. Confirm program rules and keep requests low. Do not publish reconstructed source. If one or two objects already prove private source exposure, stop there.

After an allowed reconstruction, inspect locally:

```bash
git -C evidence/repository status
git -C evidence/repository log --oneline --all --decorate -n 20
git -C evidence/repository grep -n -I -i \
  -e secret -e password -e token -e private_key -e database_url
```

A private remote name alone may be informational. Source code, credentials, internal architecture, or removed secrets establish stronger impact.

## Artifact-by-Artifact Triage

| Artifact | Usually weak | Stronger evidence |
| :--- | :--- | :--- |
| `.env*` | empty, sample, public frontend values | live secret, private connection string, signing key |
| `.git/HEAD` | isolated reference only | reconstructable private repository or sensitive history |
| `.git/config` | public repository URL | embedded credentials or private internal remote |
| `.vscode/*` | formatter or extension list | debug secrets, internal arguments, deployment command |
| `.idea/*` | module names and local layout | database config, server mapping, credentials |
| `.DS_Store` | generic filenames | discovery of sensitive unlinked files that are accessible |
| lockfile | public dependency versions | private registry token or exploitable unsupported component with reachable impact |
| source map | public source only | hidden endpoint, secret, or code enabling a proven security boundary failure |
| Terraform state | resource names only | credentials, sensitive outputs, private infrastructure data |

## Chaining Without Overreaching

An exposed artifact can lead to another finding, but each link needs proof.

```text
artifact -> sensitive value -> allowed validity check -> affected asset -> impact
```

Safe examples:

- source map reveals an undocumented in-scope endpoint; authorization is then tested with controlled accounts;
- Git history reveals a removed API key; program confirms it remains active;
- IDE config reveals an in-scope internal hostname that is publicly reachable and exposes controlled data.

Do not access out-of-scope systems merely because a leaked credential points to them. Report the exposure and ask the program how to validate.

## False Positives

- custom 404 page returns `200`;
- WAF block page returns the same body for every dotfile;
- SPA fallback serves `index.html`;
- file contains examples or public client configuration;
- Git path is blocked and no object is readable;
- remote repository is already public;
- internal hostname is disclosed but unreachable and carries no sensitive context;
- secret-looking string is a test fixture or revoked token.

## Report Checklist

Before reporting, answer:

- Which exact in-scope URL exposes the artifact?
- Can an unauthenticated user retrieve real content?
- How was soft 404 behavior ruled out?
- What sensitive information is present?
- Is proof based on controlled or minimally collected data?
- Was secret validity tested only when allowed?
- What boundary or asset is affected?
- What remains unverified?
- Which exposed values need rotation?

## Report Skeleton

```markdown
# Publicly exposed [artifact] reveals [impact]

## Summary
An unauthenticated request to [URL] returns [artifact]. The file exposes
[redacted sensitive data], which affects [in-scope asset or security boundary].

## Reproduction
1. Request [URL].
2. Observe [stable signature proving real file content].
3. Compare it with [random missing path] to rule out a soft 404.
4. Observe [redacted sensitive field or controlled impact].

## Impact
Explain what the exposed material allows. Separate confirmed impact from
possible follow-up risk.

## Evidence handling
Only partial values are shown. Full sensitive material is omitted.
```

## Remediation

- Remove development artifacts from deployment inputs and existing web roots.
- Rotate every exposed secret; removal alone does not revoke it.
- Review access logs and cloud or provider audit logs.
- Keep secrets outside source and build artifacts.
- Add CI checks for dotfiles, backups, state files, source maps, and secret patterns.
- Deny hidden development paths at the edge and origin.
- Verify staging, preview, static, and legacy hosts—not only production.
- Return a consistent denial without disclosing whether a sensitive file exists.

Example Nginx defense in depth:

```nginx
location ~ (^|/)\.(?!well-known(?:/|$)) {
    deny all;
    return 404;
}
```

Test server rules carefully. `/.well-known/` may be required for standards such as ACME or security contact files.

## Hunter's Summary

```text
Build baseline
  -> use small evidence-led path list
  -> verify file signature
  -> classify content
  -> minimize sensitive collection
  -> validate only within scope
  -> report proven impact
```

Development-file testing is not a contest to collect filenames. One real artifact with clear impact is enough.

---

## Chapter Navigation

[Previous: Exposed and Backup Files](exposed-files.md) · [Back to README](../README.md) · [Next: Subdomain Takeover](subdomain-takeover.md)
