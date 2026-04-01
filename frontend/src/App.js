import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanEmail = async () => {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:8000/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_text: email }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const getColor = (label) => {
    if (label === "Phishing") return "#ff4d4f";
    if (label === "Suspicious") return "#faad14";
    return "#52c41a";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Segoe UI"
    }}>
      <div style={{
        background: "#1e293b",
        padding: 30,
        borderRadius: 12,
        width: 500,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ color: "white", marginBottom: 20 }}>
          Phishing Email Detector
        </h2>

        <textarea
          rows="6"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "none",
            outline: "none",
            background: "#334155",
            color: "white"
          }}
          placeholder="Paste email content here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={scanEmail}
          style={{
            marginTop: 15,
            width: "100%",
            padding: 12,
            border: "none",
            borderRadius: 8,
            background: "#3b82f6",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {loading ? "Scanning..." : "Scan Email"}
        </button>

        {result && (
          <div style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 10,
            background: "#020617"
          }}>
            <h3 style={{ color: "white" }}>Result</h3>

            <p style={{ color: getColor(result.label), fontWeight: "bold" }}>
              {result.label}
            </p>

            <p style={{ color: "#94a3b8" }}>
              Score: {result.score}
            </p>

            <p style={{ color: "#94a3b8" }}>
              Confidence: {result.confidence}
            </p>

            <p style={{ color: "#94a3b8" }}>
              Reasons:
            </p>
            <ul>
              {result.reasons.map((r, i) => (
                <li key={i} style={{ color: "#cbd5f5" }}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;