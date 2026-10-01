# Implementation Plan

## Prototype delivered

- React scanner with responsive workspace and assessment view
- Flask endpoints for health, analysis, scan history, history deletion, and feedback
- Explainable Python text rules for common recruitment scam indicators
- SQLite storage for scan text, risk results, timestamps, and feedback
- Postman requests for the available API routes

## Next engineering work

1. Collect and document a representative, privacy-reviewed set of legitimate and scam postings.
2. Evaluate the existing rules, including false positive and false negative cases.
3. Build and compare a scikit-learn/NLP baseline against the rules and document performance.
4. Add JWT authentication and scope scan history and feedback to an account.
5. Add retention controls, production database configuration, and deployment for the Flask API and React frontend.
6. Validate accessibility, usability, and security before handling real user data.
