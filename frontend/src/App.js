import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const scanEmail = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_text: email }),
      });

      const data = await res.json();

      setResult(data);
      setHistory(prev => [data, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getColor = (label) => {
    if (label === "Phishing") return "#ff5a5f";
    if (label === "Suspicious") return "#fbbf24";
    return "#34d399";
  };

  const clamp = (v) => Math.max(0, Math.min(10, v || 0));

  const PieChart = ({ risk, safe }) => {
    const total = risk + safe;
    const riskDash = (risk / total) * 251.2;

    return (
      <svg width="180" height="180" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#1f2937"
          strokeWidth="10"
        />

        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#ef4444"
          strokeWidth="10"
          strokeDasharray={`${riskDash} 251.2`}
          transform="rotate(-90 50 50)"
        />

        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#e5e7eb"
          fontSize="12"
          fontWeight="600"
        >
          {risk}/{total}
        </text>
      </svg>
    );
  };

  const segments = result
    ? { risk: clamp(result.score), safe: 10 - clamp(result.score) }
    : null;

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">Email Threat Analyzer</h1>

        <textarea
          className="textarea"
          placeholder="Paste email content..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn" onClick={scanEmail}>
          {loading ? "Analyzing..." : "Scan Email"}
        </button>

        {result && (
          <div className="result">
            <div className="resultHeader">
              <span
                className="badge"
                style={{ background: getColor(result.label) }}
              >
                {result.label}
              </span>
              <span className="score">Score: {result.score}</span>
            </div>

            <div className="chartWrap">
              {segments && (
                <PieChart risk={segments.risk} safe={segments.safe} />
              )}
            </div>

            <div className="meta">
              <p>Confidence: {result.confidence}</p>
            </div>

            <div className="reasons">
              <h3>Signals</h3>
              <ul>
                {(result.reasons || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="history">
            <h2>History</h2>
            {history.map((h, i) => (
              <div key={i} className="historyItem">
                <span style={{ color: getColor(h.label) }}>
                  {h.label}
                </span>
                <span className="historyScore">{h.score}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        body {
          margin: 0;
          background: #0b1220;
          font-family: ui-sans-serif, system-ui;
        }

        .app {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px;
        }

        .card {
          width: 520px;
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .title {
          color: #f9fafb;
          font-size: 22px;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .textarea {
          width: 100%;
          height: 140px;
          background: #0f172a;
          color: #e5e7eb;
          border: 1px solid #1f2937;
          border-radius: 12px;
          padding: 12px;
          outline: none;
          resize: none;
        }

        .textarea:focus {
          border-color: #3b82f6;
        }

        .btn {
          width: 100%;
          margin-top: 12px;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .btn:hover {
          opacity: 0.95;
        }

        .result {
          margin-top: 18px;
          padding: 16px;
          background: #0b1220;
          border-radius: 12px;
          border: 1px solid #1f2937;
        }

        .resultHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 999px;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .score {
          color: #9ca3af;
          font-size: 14px;
        }

        .chartWrap {
          display: flex;
          justify-content: center;
          margin: 12px 0;
        }

        .meta {
          color: #9ca3af;
          font-size: 14px;
        }

        .reasons h3 {
          color: #f9fafb;
          margin-bottom: 6px;
        }

        .reasons ul {
          color: #d1d5db;
          padding-left: 18px;
        }

        .history {
          margin-top: 16px;
        }

        .history h2 {
          color: #f9fafb;
          font-size: 16px;
        }

        .historyItem {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: #0f172a;
          border-radius: 8px;
          margin-top: 8px;
          border: 1px solid #1f2937;
        }

        .historyScore {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

export default App;