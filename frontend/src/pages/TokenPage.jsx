import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerToken } from "../services/customerTokenStorage";

function secondsBetween(a, b) {
  return Math.max(0, Math.floor((b.getTime() - a.getTime()) / 1000));
}

export default function TokenPage() {
  const navigate = useNavigate();
  const stored = useMemo(() => getCustomerToken(), []);
  const [now, setNow] = useState(() => new Date());

  const token = stored?.token;
  const expiresAt = stored?.expiresAt;

  const secondsLeft = useMemo(() => {
    if (!expiresAt) return 120;
    return secondsBetween(now, expiresAt);
  }, [expiresAt, now]);

  const isExpired = expiresAt ? secondsLeft <= 0 : false;

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!token) {
    return (
      <div className="sp-page">
        <div className="sp-container">
          <div className="sp-card" style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2 style={{ marginTop: 0 }}>No Token Found</h2>
            <div style={{ color: "var(--sp-muted)", fontWeight: 700, marginTop: 8 }}>
              Please upload a document first.
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="sp-btn sp-btn-primary" onClick={() => navigate("/upload")}>
                Go to Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-page">
      <div className="sp-container">
        <div className="sp-card" style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ marginTop: 0 }}>Token Status</h2>
          <div className="sp-divider" />

          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>
            ✅ Document Uploaded Successfully
          </div>

          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
            🔐 Token:{" "}
            <span style={{ color: "var(--sp-blue)", wordBreak: "break-word" }}>{token}</span>
          </div>

          <div style={{ fontSize: 16, fontWeight: 800 }}>
            Status: {isExpired ? "Expired" : "Waiting"}
          </div>

          <div style={{ color: "var(--sp-muted)", fontWeight: 700, marginTop: 12 }}>
            Time remaining: {secondsLeft}s
          </div>
        </div>
      </div>
    </div>
  );
}

