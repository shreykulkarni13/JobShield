# JobShield detection engine

The current prototype detection rules live in `backend/app/detector.py` so the Flask API can return risk signals and explanations in one request. They are hand-authored heuristics, not an ML model.

## Future model work

Before training a scikit-learn classifier:

1. Collect and document a representative dataset of legitimate and fraudulent postings.
2. Record source, labeling method, consent, and any personal-data removal.
3. Split by source or time as well as randomly to reduce leakage.
4. Compare a transparent TF-IDF baseline with the current rules and report precision, recall, false-positive rates, and class balance.
5. Keep safety guidance and explanations visible; do not label a posting legitimate solely because the model score is low.

No training dataset or validated model is included in this prototype.
