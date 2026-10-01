# JobShield Technical Requirements

## Implemented prototype stack

### Frontend

React and JavaScript, served during development with Vite. The interface supports text entry, an explainable assessment, a recent scan list, and feedback.

### API and detection

Python and Flask expose JSON endpoints. A hand-authored Python rule engine identifies common warning signs and returns a capped risk score, category, explanations, and verification guidance.

### Persistence

SQLite stores scan text, result, timestamp, and feedback. The default database is `backend/instance/jobshield.db` and can be changed with `JOBSHIELD_DATABASE`.

### Development tools

Git, GitHub, and the Postman collection support development and API exploration.

## Planned production capabilities

- JWT authentication and user-owned scan history
- A representative, reviewed dataset and a measured scikit-learn/NLP baseline
- Model and rule evaluation for false positives, false negatives, and class imbalance
- Production database, retention controls, deployment configuration, and security review
- A separately hosted Flask API and persistent database alongside the proposed Vercel frontend

These production capabilities are not present in the current prototype. See [architecture.md](architecture.md) for boundaries and request flow.
