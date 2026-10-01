# JobShield Prototype Architecture

## Request flow

```text
React + JavaScript (Vite)
       │ JSON over HTTP
       ▼
Flask REST API ─────── CORS allowlist
       │
       ├── Python explainable text rules
       │       └── score, category, signals, safety guidance
       │
       └── SQLite
               └── scan text, assessment, timestamp, feedback
```

## Components

### Frontend

The React scanner submits a job description or recruiter message to `POST /api/analyze`, presents the score, category, signal explanations, and suggested checks, and provides a recent history view. Set `VITE_API_BASE_URL` at build time when the API is not at `http://localhost:5000/api`.

### API and storage

Flask validates input and exposes health, analyze, history, clear-history, and feedback routes. SQLite stores scans on the API host. The default database is `backend/instance/jobshield.db`; `JOBSHIELD_DATABASE` can override it. CORS accepts local Vite origins by default; production origins belong in `CORS_ORIGINS`.

### Detection

The prototype uses hand-authored Python rules and capped additive weights. Findings cover requests for payment or sensitive data, suspicious compensation claims, urgency, informal contact channels, personal email, check deposits, higher-risk link endings, vague company identity, and limited role context. The returned assessment explicitly states that the implementation is not a trained classifier and does not establish whether an employer is genuine.

## Prototype boundaries

- No trained scikit-learn model or representative labeled dataset is included.
- JWT authentication and user accounts are not implemented; endpoints are unauthenticated and intended for local demonstration.
- Scan text is stored in SQLite to support history. Use only sample or non-sensitive text.
- Production hosting needs authentication, database access controls, retention/deletion policy, HTTPS, secret management, and a validated detection model.
- Vercel remains the proposed frontend deployment target; the Flask API and SQLite database need a separately suitable hosting arrangement for a deployed end-to-end system.
