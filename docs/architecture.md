# JobShield — System Architecture

```text
User
  |
  v
React + JavaScript Frontend
  |
  | HTTP / REST API
  v
Python + Flask Backend
  |
  +----------------------+
  |                      |
  v                      v
Detection Engine       SQLite
  |
  +----------------------+
  |
  +--> NLP preprocessing
  +--> Feature extraction
  +--> scikit-learn baseline classifier
  +--> Complementary scam rules
  +--> Risk score
  +--> Human-readable reasons
  |
  v
Risk Result + Safety Guidance
```

## Planned Components

### Frontend
- Scanner UI
- Risk result UI
- Dashboard
- History
- Feedback

### Backend
- Authentication API
- Scanner API
- History API
- Feedback API

### AI/NLP
- Text preprocessing
- Feature extraction
- Baseline classification
- Scam-pattern rules
- Explainability layer

### Database
- Users
- Scans
- Risk signals
- Feedback

This is the planned architecture from the Phase 1 concept and will be refined during implementation.
