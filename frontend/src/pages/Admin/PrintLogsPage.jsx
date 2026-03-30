import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { getAuth } from "../../services/authStorage";

function formatTime(value) {
  try {
    const d = new Date(value);
    return d.toLocaleString([], { hour: "2-digit", minute: "2-digit", year: "numeric", month: "short", day: "2-digit" });
  } catch (_e) {
    return String(value);
  }
}

export default function PrintLogsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);

  async function loadLogs() {
    setError("");
    setLoading(true);
    try {
      const token = getAuth()?.token;
      const res = await api.get("/logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data?.logs || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sp-page">
      <div className="sp-container">
        <div className="sp-card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ marginTop: 0 }}>Print Logs</h2>
              <div style={{ color: "var(--sp-muted)", fontWeight: 900 }}>Token | Copies | Type | Time | Status</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="sp-btn sp-btn-secondary" type="button" onClick={() => navigate("/admin/dashboard")}>
                Back to Dashboard
              </button>
              <button className="sp-btn sp-btn-secondary" type="button" onClick={loadLogs}>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error ? <div style={{ color: "#ef4444", fontWeight: 800, marginBottom: 16 }}>{error}</div> : null}
        {loading ? <div style={{ fontWeight: 1000, marginBottom: 16 }}>Loading logs...</div> : null}

        <table className="sp-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Copies</th>
              <th>Type</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ color: "var(--sp-muted)", fontWeight: 900 }}>
                  No logs yet.
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={`${l.token}-${l.time}`}>
                  <td style={{ wordBreak: "break-word" }}>{l.token}</td>
                  <td>{l.copies ?? "-"}</td>
                  <td>{l.type ?? "-"}</td>
                  <td>{formatTime(l.time)}</td>
                  <td>{l.status ?? "completed"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}