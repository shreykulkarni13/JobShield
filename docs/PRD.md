# JobShield Product Requirements

## Problem

Fake job postings and recruitment scams can imitate legitimate opportunities and trick job seekers into paying fees, sharing personal information, or clicking suspicious links. Users need a quick first review and clear ways to check details themselves.

## Product

JobShield lets a user paste a job description or recruiter message and receive an explainable review. It shows a risk category and score, highlights matching warning signs, gives practical verification steps, and keeps recent scans available in a local history.

## Core user flow

1. Paste the posting or recruiter message into the scanner.
2. Review the risk category, score, and each detected signal.
3. Follow independent verification steps before responding or sharing information.
4. Optionally leave feedback or revisit the scan from history.

## Risk categories

- Lower risk
- Suspicious
- High risk

These labels describe only the prototype's text signals. A lower-risk result does not confirm that an employer or opening is genuine.

## Prototype scope

The current prototype includes the scanner interface, Python rule engine, Flask API, SQLite scan history, and feedback endpoint. It does not include user accounts, JWT authentication, a validated ML classifier, or external company verification. Scans are retained in the local prototype database; use sample or non-sensitive text.
