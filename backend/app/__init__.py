import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, current_app, g, jsonify, request
from flask_cors import CORS

from .detector import analyze_text


def _database_path() -> Path:
    configured = os.getenv("JOBSHIELD_DATABASE", "")
    if configured:
        return Path(configured).expanduser().resolve()
    return Path(__file__).resolve().parents[1] / "instance" / "jobshield.db"


def get_db():
    if "db" not in g:
        path = current_app.config["DATABASE_PATH"]
        path.parent.mkdir(parents=True, exist_ok=True)
        g.db = sqlite3.connect(path)
        g.db.row_factory = sqlite3.Row
    return g.db


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.update(DATABASE_PATH=_database_path(), MAX_CONTENT_LENGTH=64 * 1024)
    if test_config:
        app.config.update(test_config)
    origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    CORS(app, resources={r"/api/*": {"origins": [origin.strip() for origin in origins]}})

    Path(app.config["DATABASE_PATH"]).parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(app.config["DATABASE_PATH"]) as connection:
        connection.execute("""CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            category TEXT NOT NULL,
            score INTEGER NOT NULL,
            result_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            feedback TEXT
        )""")

    @app.teardown_appcontext
    def close_db(_error=None):
        database = g.pop("db", None)
        if database is not None:
            database.close()

    @app.errorhandler(413)
    def too_large(_error):
        return jsonify(error="Posting is too large. Please keep it under 50 KB."), 413

    @app.get("/api/health")
    def health():
        return jsonify(status="ok", project="JobShield")

    @app.post("/api/analyze")
    def analyze():
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return jsonify(error="Send a JSON object with a text field."), 400
        text = payload.get("text")
        if not isinstance(text, str) or not text.strip():
            return jsonify(error="Paste a job posting or recruiter message to analyze."), 400
        text = text.strip()
        if len(text) > 50_000:
            return jsonify(error="Posting is too large. Please keep it under 50 KB."), 413

        result = analyze_text(text)
        created_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
        cursor = get_db().execute(
            "INSERT INTO scans (text, category, score, result_json, created_at) VALUES (?, ?, ?, ?, ?)",
            (text, result["category"], result["score"], json.dumps(result), created_at),
        )
        get_db().commit()
        result.update(id=cursor.lastrowid, created_at=created_at)
        return jsonify(result), 201

    @app.get("/api/history")
    def history():
        rows = get_db().execute(
            "SELECT id, text, category, score, result_json, created_at, feedback FROM scans ORDER BY id DESC LIMIT 30"
        ).fetchall()
        items = []
        for row in rows:
            item = dict(row)
            item["result"] = json.loads(item.pop("result_json"))
            items.append(item)
        return jsonify(items=items)

    @app.delete("/api/history")
    def clear_history():
        get_db().execute("DELETE FROM scans")
        get_db().commit()
        return jsonify(status="cleared")

    @app.post("/api/feedback")
    def feedback():
        payload = request.get_json(silent=True) or {}
        scan_id = payload.get("scan_id")
        value = payload.get("value")
        if value not in {"helpful", "not_helpful"}:
            return jsonify(error="Feedback must be helpful or not_helpful."), 400
        cursor = get_db().execute("UPDATE scans SET feedback = ? WHERE id = ?", (value, scan_id))
        get_db().commit()
        if cursor.rowcount == 0:
            return jsonify(error="Scan not found."), 404
        return jsonify(status="saved")

    return app
