# JobShield

**A clear first check for recruitment scams.** JobShield reviews a job posting or recruiter message, points out common warning signs, and suggests ways to verify an opportunity before you respond.

> JobShield is a local prototype. Its text rules can surface clues, but cannot confirm whether a company, recruiter, or job is genuine. A lower-risk result is not proof of legitimacy.

## What it does

- Scans pasted job descriptions and recruiter messages.
- Returns an explainable risk score, category, matching signals, and practical safety guidance.
- Saves recent scans in a local SQLite database so they can be revisited.
- Collects optional helpful / not helpful feedback.
- Provides a Postman collection for the API.

## Preview the app locally

You need Python 3.10+ and Node.js 20.19+ (or 22.12+).

### 1. Start the API

From the repository root, open a PowerShell terminal:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

The API listens at `http://localhost:5000`. It creates its SQLite database at `backend/instance/jobshield.db` the first time it starts.

### 2. Start the web app

Open a second terminal at the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local Vite address printed in the terminal, usually `http://localhost:5173`.

### Configuration

The frontend defaults to `http://localhost:5000/api`. Override it with `VITE_API_BASE_URL` in `frontend/.env.local`. The API allows the two local Vite origins by default; set `CORS_ORIGINS` to comma-separated exact origins when hosting the frontend elsewhere. Set `JOBSHIELD_DATABASE` to choose a different SQLite file. These are environment variables; `.env.example` documents the expected values.

## How a scan works

```text
Paste text → React sends JSON → Flask validates input → Python rules inspect signals
    → risk score and explanations → SQLite saves scan → React shows assessment
```

The current engine uses hand-written patterns and weights, not a trained machine-learning model. See [brain.md](brain.md) for the full architecture, scan lifecycle, rule weights, API contract, storage schema, UI states, setup, and production boundaries.

## API at a glance

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check API availability |
| `POST` | `/analyze` | Analyze and save text; returns the assessment |
| `GET` | `/history` | Return up to 30 recent scans |
| `DELETE` | `/history` | Delete all saved scans |
| `POST` | `/feedback` | Save feedback for a scan |

### Example request

```http
POST /api/analyze
Content-Type: application/json

{
  "text": "Paste a job posting or recruiter message here."
}
```

Import [`postman/JobShield.postman_collection.json`](postman/JobShield.postman_collection.json) to try the endpoints from Postman.

## Technology

| Area | Technology |
| --- | --- |
| Web interface | React 19, JavaScript, Vite 7, CSS |
| API | Python, Flask, Flask-CORS |
| Detection | Explainable Python text rules |
| Persistence | SQLite via Python's standard library |
| API exploration | Postman |

## Project map

```text
backend/     Flask app, API routes, rule engine, SQLite database at runtime
frontend/    React interface and styles
ml/          Model research notes and future ML work
docs/        Product requirements, architecture, technical requirements, plan
postman/     API collection and instructions
brain.md     Full project and system reference
```

## Prototype boundaries

- The API has no accounts or JWT authentication; scan history is shared by this local prototype instance.
- The database retains pasted text to support history. Use sample or non-sensitive text.
- No labeled dataset, trained scikit-learn model, company lookup, or external verification is included.
- The proposed Vercel frontend target does not host this Flask API and SQLite persistence by itself. A deployed system needs a separately hosted API and suitable persistent storage.
- Before production use, add authentication, access controls, retention and deletion policies, HTTPS, secret management, and measured model/rule evaluation.

## Further reading

- [Full project reference](brain.md)
- [Product requirements](docs/PRD.md)
- [Architecture](docs/architecture.md)
- [Technical requirements](docs/TRD.md)
- [Implementation plan](docs/implementation-plan.md)
