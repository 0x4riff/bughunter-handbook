---
title: "Exposed and Backup Files"
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

# Exposed and Backup Files

## Table of Contents

- [Start Close to the Application](#start-close-to-the-application)
- [Classify Before You Report](#classify-before-you-report)
- [Fix Direction](#fix-direction)
- [Deep-Dive Chapter](#deep-dive-chapter)
- [Fast Decision Tree](#fast-decision-tree)
- [Artifact Families](#artifact-families)
- [Validate Content Type and Signature](#validate-content-type-and-signature)
- [Backup Naming Logic](#backup-naming-logic)
- [Archives and Database Dumps](#archives-and-database-dumps)
- [Source Maps](#source-maps)
- [Logs and Debug Output](#logs-and-debug-output)
- [Remediation](#remediation)

A forgotten file matters when it reveals something that was not meant to be public. The filename alone is not the finding.

## Start Close to the Application

Good leads often come from HTML and JavaScript references, source maps, deployment manifests, robots and sitemap files, framework error paths, documented filenames, and public archives.

This keeps discovery tied to evidence. Avoid broad filename brute force when the program does not allow it.

## Classify Before You Report

Ask what the file contains:

- public content placed at an unusual path;
- harmless build or framework metadata;
- source code without sensitive material;
- a credential or token;
- private internal or personal data.

If you meet the last category, stop collecting. If you find a credential, validate it only through an allowed, non-destructive method. Often the right next step is reporting exposure and letting the owner rotate it.

An HTTP 200, a large response, or a `.bak` suffix does not establish impact. Confirm content, sensitivity, who can reach it, and what the exposed material allows.

## Fix Direction

Keep backups and secrets out of deployment artifacts. Block risky patterns in build and server configuration, scan commits and artifacts for secrets, and rotate anything that reached a public host.

## Deep-Dive Chapter

For path lists, soft-404 calibration, Git evidence levels, secret triage, command examples, report skeleton, and deployment fixes, use [Exposed Development Files](exposed-development-files.md).

## Fast Decision Tree

```text
interesting path
  -> real file signature?
     no: discard
     yes: sensitive content?
       no: note or discard
       yes: controlled proof + redaction
         -> allowed impact validation?
            no: report exposure and limits
            yes: validate minimally, then stop
```

## Artifact Families

Look for backups, source maps, logs, database exports, archives, temporary files, generated reports, cloud state, configuration, and deployment manifests. Let technology and observed filenames guide checks.

## Validate Content Type and Signature

A successful status can still be a branded error page. Compare against random missing paths, inspect headers, parse the expected format, and identify stable file signatures.

## Backup Naming Logic

Developers and deployment tools commonly add dates, editor suffixes, extensions, or copies. Test a small set derived from an observed filename rather than a huge generic list.

## Archives and Database Dumps

These may contain large amounts of real data. Do not download a complete archive merely to prove it exists. Range requests or program-assisted validation may establish type and sensitivity with less collection when allowed.

## Source Maps

Source maps may reveal source, routes, and comments. Public source is not always sensitive. Report secrets, private code, hidden functionality, or a proven chain—not source readability alone.

## Logs and Debug Output

Check for tokens, session IDs, personal data, internal paths, stack traces, and request bodies. Stop when real user records appear.

## Remediation

Remove artifacts, rotate exposed secrets, review access logs, isolate generated exports, disable debug publication, and add deployment allowlists plus CI artifact scanning.

---

## Chapter Navigation

[Previous: Testing 403 Responses](403-testing.md) · [Back to README](../README.md) · [Next: Exposed Development Files](exposed-development-files.md)
