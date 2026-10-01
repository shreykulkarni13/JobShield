import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const API = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
const sample = `Remote Data Entry Assistant\nNorthstar Digital is looking for a detail-oriented assistant to support our growing team. Flexible part-time work, no experience needed.\nEarn $4,500 per week working just 2 hours a day. We are hiring immediately and have limited slots available.\nTo secure your position, send a $45 equipment registration fee by gift card today. Our recruiter will contact you on Telegram: @northstar_hiring.\nContact: northstarjobs@gmail.com`;

function Icon({ name, size = 18 }) {
  const paths = {
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 12h10"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function App() {
  const [page, setPage] = useState("scanner");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");
  const [feedback, setFeedback] = useState("");

  async function loadHistory() {
    try {
      const response = await fetch(`${API}/history`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setHistory(data.items || []);
      setApiStatus("online");
    } catch {
      setApiStatus("offline");
    }
  }
  useEffect(() => { loadHistory(); }, []);

  async function analyze(event) {
    event.preventDefault();
    if (text.trim().length < 25) { setError("Add a little more context so the scanner can review the message."); return; }
    setBusy(true); setError(""); setFeedback(""); setResult(null);
    try {
      const response = await fetch(`${API}/analyze`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis could not be completed.");
      setResult(data);
      await loadHistory();
    } catch (err) {
      setError(apiStatus === "offline" ? "Can’t reach the JobShield API. Start the Flask server, then try again." : err.message);
    } finally { setBusy(false); }
  }

  async function sendFeedback(value) {
    if (!result?.id) return;
    try {
      const response = await fetch(`${API}/feedback`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scan_id: result.id, value }) });
      if (!response.ok) throw new Error();
      setFeedback(value);
    } catch { setError("Feedback could not be saved. Check the API connection and try again."); }
  }

  async function clearHistory() {
    try { await fetch(`${API}/history`, { method: "DELETE" }); setHistory([]); }
    catch { setError("History could not be cleared. Check the API connection."); }
  }

  const stats = useMemo(() => ({ total: history.length, flagged: history.filter(item => item.category !== "low_risk").length }), [history]);
  const scoreTone = result?.category || "low_risk";
  const count = text.length;

  return <div className="shell">
    <aside className="sidebar">
      <a className="brand" href="#scanner" onClick={() => setPage("scanner")}><span className="brand-mark"><Icon name="shield" size={21}/></span><span>jobshield<span className="brand-dot">.</span><small>TRUST, BEFORE YOU APPLY</small></span></a>
      <div className="nav-label">WORKSPACE</div>
      <button className={`nav-item ${page === "scanner" ? "active" : ""}`} onClick={() => setPage("scanner")}><Icon name="scan"/> Risk scanner</button>
      <button className={`nav-item ${page === "history" ? "active" : ""}`} onClick={() => setPage("history")}><Icon name="clock"/> Scan history <span className="nav-count">{history.length}</span></button>
      <div className="sidebar-spacer"/>
      <div className="privacy-card"><span className="privacy-icon"><Icon name="shield" size={16}/></span><div><strong>Your safety, first</strong><p>JobShield provides an initial assessment, not a guarantee. Always verify opportunities independently.</p></div></div>
      <div className="sidebar-footer"><span className={`status-dot ${apiStatus}`}/><span>{apiStatus === "online" ? "Scanner connected" : apiStatus === "offline" ? "API unavailable" : "Connecting to scanner"}</span><span className="version">PROTOTYPE</span></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>{page === "scanner" ? "Risk scanner" : "Scan history"}</strong></div><div className="topbar-right"><span className="secure-tag"><Icon name="shield" size={14}/> Prototype workspace</span><span className="avatar">JS</span></div></header>
      {page === "scanner" ? <div className="content">
        <section className="intro"><div className="eyebrow"><span/> RECRUITMENT SAFETY, MADE CLEAR</div><h1>Check before you commit.</h1><p>Review a job post or recruiter message for common scam signals. Get a clear assessment and practical next steps.</p></section>
        <section className="workspace-grid">
          <div className="input-column">
            <form className="scan-card" onSubmit={analyze}>
              <div className="card-heading"><div><span className="step">01</span><h2>Paste a job post or message</h2></div><button type="button" className="text-button" onClick={() => { setText(sample); setResult(null); setError(""); }}>Try sample <Icon name="arrow" size={14}/></button></div>
              <p className="card-help">Include the description and any messages from the recruiter for a more useful review.</p>
              <div className="textarea-wrap"><textarea value={text} onChange={event => { setText(event.target.value); setError(""); }} placeholder="Paste the job description, email, or recruiter message here…" maxLength={50000} aria-label="Job posting or recruiter message"/><div className="text-meta"><span><Icon name="file" size={14}/> Your text stays in this prototype’s local database</span><span>{count.toLocaleString()} / 50,000</span></div></div>
              {error && <div className="error-message"><Icon name="close" size={15}/>{error}</div>}
              <div className="form-bottom"><span className="input-hint"><span className="tiny-shield"><Icon name="shield" size={13}/></span> No account needed to scan</span><button className="primary-button" type="submit" disabled={busy || !text.trim()}>{busy ? <><span className="spinner"/> Reviewing…</> : <><Icon name="scan" size={17}/> Analyze posting</>}</button></div>
            </form>
            <div className="signal-strip"><div className="signal-heading"><span className="signal-pip"/><strong>What we look for</strong><span>Transparent signals, explained plainly</span></div><div className="signal-tags">{["Payment requests", "Sensitive data", "Unusual pay", "Urgency", "Contact details", "Links"].map(tag => <span key={tag}>{tag}</span>)}</div></div>
            <div className="disclaimer"><Icon name="shield" size={16}/><p><strong>An assessment, not a verdict.</strong> A low score does not prove a job is legitimate. Confirm the role and recruiter through the company’s official channels.</p></div>
          </div>

          <aside className="right-column">
            {result ? <section className="result-card"><div className="result-top"><div><span className="section-kicker">ASSESSMENT</span><h2>Your results</h2></div><span className="result-date">JUST NOW</span></div>
              <div className={`score-panel ${scoreTone}`}><div className="score-ring" style={{ "--score": `${result.score * 3.6}deg` }}><div><strong>{result.score}</strong><small>/ 100</small></div></div><div className="score-copy"><span className="category-pill">{result.label}</span><p>{result.summary}</p></div></div>
              <div className="findings-head"><h3>Signals found</h3><span>{result.indicators.length} {result.indicators.length === 1 ? "signal" : "signals"}</span></div>
              {result.indicators.length ? <div className="findings-list">{result.indicators.map(item => <article className="finding" key={item.id}><span className={`finding-dot ${item.severity}`}/><div><strong>{item.title}</strong><p>{item.detail}</p></div></article>)}</div> : <div className="empty-signals"><span className="empty-check"><Icon name="check"/></span><div><strong>No common red flags detected</strong><p>That’s a useful starting point. It is not a guarantee of legitimacy.</p></div></div>}
              <div className="guidance"><h3>Before you respond</h3>{result.guidance.map((tip, index) => <div className="guidance-row" key={tip}><span>{String(index + 1).padStart(2, "0")}</span><p>{tip}</p></div>)}</div>
              <div className="model-note">{result.model_note}</div>
              <div className="feedback-row"><span>{feedback ? "Thanks for the feedback" : "Was this assessment useful?"}</span>{feedback ? <span className="feedback-saved"><Icon name="check" size={14}/> Recorded</span> : <div><button onClick={() => sendFeedback("helpful")}>Yes</button><button onClick={() => sendFeedback("not_helpful")}>No</button></div>}</div>
            </section> : <section className="empty-result"><div className="empty-art"><div className="art-ring ring-one"/><div className="art-ring ring-two"/><div className="art-icon"><Icon name="shield" size={27}/></div><span className="art-check"><Icon name="check" size={13}/></span></div><span className="section-kicker">YOUR RESULTS</span><h2>Clarity before the next step.</h2><p>Your assessment will appear here with the signals found, what they may mean, and ways to verify the opportunity.</p><div className="empty-divider"/><div className="empty-feature"><span><Icon name="check" size={15}/></span><p><strong>Explainable by design</strong><br/>See the specific text patterns behind each signal.</p></div><div className="empty-feature"><span><Icon name="check" size={15}/></span><p><strong>Practical next steps</strong><br/>Know what to verify before sharing information.</p></div></section>}
            <div className="mini-stats"><div><span>POSTINGS REVIEWED</span><strong>{stats.total}</strong></div><div><span>FLAGGED FOR REVIEW</span><strong>{stats.flagged}</strong></div><button onClick={() => setPage("history")}>View history <Icon name="arrow" size={14}/></button></div>
          </aside>
        </section>
      </div> : <div className="content history-content">
        <section className="intro"><div className="eyebrow"><span/> YOUR RECENT REVIEWS</div><h1>Scan history</h1><p>Assessments are stored locally in this prototype so you can revisit recent results.</p></section>
        <section className="history-card"><div className="history-head"><div><h2>Recent scans</h2><p>{history.length} of your latest assessments</p></div>{history.length > 0 && <button className="text-button danger-text" onClick={clearHistory}>Clear history</button>}</div>
          {history.length ? <div className="history-list">{history.map(item => <button key={item.id} className="history-item" onClick={() => { setText(item.text); setResult({ ...item.result, id: item.id, created_at: item.created_at }); setPage("scanner"); }}><span className={`history-risk ${item.category}`}><span/>{item.category === "high_risk" ? "High risk" : item.category === "suspicious" ? "Suspicious" : "Lower risk"}</span><span className="history-excerpt">{item.text.replace(/\s+/g, " ").slice(0, 125)}{item.text.length > 125 ? "…" : ""}</span><span className="history-score">{item.score}<small>/100</small></span><span className="history-time">{new Date(item.created_at).toLocaleDateString()}</span></button>)}</div> : <div className="history-empty"><span><Icon name="clock" size={21}/></span><h3>No scans yet</h3><p>Once you review a job post, it will show up here.</p><button className="primary-button" onClick={() => setPage("scanner")}>Go to scanner <Icon name="arrow" size={15}/></button></div>}
        </section>
      </div>}
      <footer className="page-footer"><span>JOBSHIELD <span className="footer-dot">·</span> RECRUITMENT SAFETY TOOL</span><span>Prototype assessment · Always verify independently</span></footer>
    </main>
  </div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
