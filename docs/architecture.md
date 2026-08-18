# JobShield — Technical Architecture Skeleton

> Phase 1 — Idea Submission  
> AI-powered fake job posting & recruitment scam detection

## 1. Proposed System Flow

```text
User
  ↓
React + JavaScript Frontend
  ↓
Flask REST API
  ↓
Job Posting / Recruiter Message
  ↓
Text Pre-processing
  ↓
AI/NLP Analysis + Rule-based Scam Indicators
  ↓
Risk Scoring & Explainability
  ↓
Result
  ├── Risk Score
  ├── Risk Category
  ├── Detected Indicators
  └── Safety Guidance
```

## 2. Planned Components

### Frontend
React + JavaScript interface for:
- Job posting / recruiter message input
- Analysis request
- Risk result visualization
- Detected scam indicators
- Safety recommendations

### Backend
Python + Flask REST API responsible for:
- Receiving analysis requests
- Validating and processing input
- Connecting the frontend with the detection engine
- Returning analysis results

### AI/NLP Layer
Python + scikit-learn / NLP libraries planned for:
- Text preprocessing
- Feature extraction
- Scam classification
- Supporting risk assessment

### Rule-based Detection Layer
Planned checks for common recruitment scam indicators such as:
- Upfront payment requests
- Unrealistic salary or benefits
- Suspicious contact details
- Urgency/manipulation patterns
- Other suspicious job-posting signals

### Database
SQLite for the prototype.

Planned data includes:
- User information
- Job analysis records
- Risk results
- Detected indicators
- User feedback

## 3. Planned Output

The system is intended to provide:

**Risk Score → Risk Category → Reasons → Safety Guidance**

Example:

```text
Risk Score: 87%
Category: HIGH RISK

Detected Indicators:
- Payment request
- Unrealistic compensation
- Suspicious contact pattern

Recommendation:
Verify the recruiter/company independently before proceeding.
```

> The above is a proposed output format, not an implemented result.

## 4. Planned Development Structure

```text
frontend/     → React application
backend/      → Flask REST API
ml/           → AI/NLP and detection engine
docs/         → Project documentation
postman/      → API testing collection
```

## 5. Phase 1 Status

This file documents the **proposed technical architecture only**.

Core application functionality, trained models, APIs and database implementation
will be developed in the subsequent development phase if the project advances.
