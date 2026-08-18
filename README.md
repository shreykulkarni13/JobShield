# JobShield

AI-powered fake job posting & recruitment scam detection system.

## Phase 1 — Idea Submission

This repository is the initial project skeleton for the JobShield hackathon project.

### Proposed Technology Stack

- Frontend: React + JavaScript
- Backend: Python + Flask
- AI/NLP: Python + scikit-learn / NLP libraries
- Database: SQLite
- Authentication: JWT
- Development/API testing: Git, GitHub, Postman
- Deployment target: Vercel (as stated in the Phase 1 proposal)

### Planned Product

JobShield will allow a user to paste a job posting or recruiter message. The system will analyze textual and contextual scam signals, produce an explainable risk score, identify contributing scam indicators, and provide safety guidance.

### Planned Implementation

1. Research — identify scam patterns and prepare representative legitimate/scam examples.
2. Detection Engine — preprocessing, feature extraction, baseline classification and complementary rules.
3. Risk & Explainability — combine signals into a clear score and human-readable reasons.
4. Application — Flask APIs, SQLite database, scanner UI and dashboard.
5. Validation — test false positives/negatives, usability and security.
6. Deployment — deploy the working prototype and prepare demo scenarios.

## Repository Status

Phase 1 skeleton only. Core application functionality will be implemented in the subsequent development phase if the project advances.

## Planned Structure

- `frontend/` — React + JavaScript application
- `backend/` — Flask API and SQLite integration
- `ml/` — scikit-learn/NLP detection engine and training assets
- `docs/` — product, technical and architecture documentation
- `postman/` — API collections for testing
