import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <main className="app">
      <h1>JobShield</h1>
      <p>AI-powered fake job posting & recruitment scam detection.</p>
      <p className="status">Phase 1 project skeleton</p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
