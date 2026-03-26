import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { getAuth, clearAuth } from "../../services/authStorage";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const auth = useMemo(() => getAuth(), []);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trustScore, setTrustScore] = useState(() => (typeof getAuth()?.trustScore === "number" ? getAuth().trustScore : auth?.trustScore || 0));

  async function loadStats() {
    setError("");
    setLoading(true);
    try {
      const token = getAuth()?.token;
      const res = await api.get("/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
      if (typeof res.data?.trustScore === "number") setTrustScore(res.data.trustScore);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch stats.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
    // Keep trust score in sync if another page updates localStorage.
    const updateTrustScore = () => {
      const next = getAuth()?.trustScore;
      if (typeof next === "number") setTrustScore(next);
    };
    updateTrustScore();
    window.addEventListener("storage", updateTrustScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => window.removeEventListener("storage", updateTrustScore);
  }, []);

  function handleLogout() {
    clearAuth();
    navigate("/");
  }

  return (
    <div className="sp-page">
      <div className="sp-container">
        <div className="sp-card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ marginTop: 0 }}>Admin Dashboard</h2>
              <div style={{ color: "var(--sp-muted)", fontWeight: 800 }}>
                Analytics + Trust Score
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button className="sp-btn sp-btn-secondary" onClick={() => navigate("/admin/print")} type="button">
                Print Panel
              </button>
              <button className="sp-btn sp-btn-secondary" onClick={() => navigate("/admin/logs")} type="button">
                Print Logs
              </button>
              <button className="sp-btn sp-btn-secondary" onClick={handleLogout} type="button">
                Logout
              </button>
            </div>
          </div>
        </div>

        {error ? <div style={{ color: "#ef4444", fontWeight: 800, marginBottom: 16 }}>{error}</div> : null}

        {loading ? <div style={{ fontWeight: 900 }}>Loading analytics...</div> : null}

        <div className="sp-grid-2" style={{ marginBottom: 16 }}>
          <div className="sp-card">
            <div style={{ fontWeight: 900, fontSize: 14, color: "var(--sp-muted)" }}>Total Users</div>
            <div style={{ fontWeight: 1000, fontSize: 34 }}>{stats?.totalUsers ?? 0}</div>
          </div>
          <div className="sp-card">
            <div style={{ fontWeight: 900, fontSize: 14, color: "var(--sp-muted)" }}>Total Prints</div>
            <div style={{ fontWeight: 1000, fontSize: 34 }}>{stats?.totalPrints ?? 0}</div>
          </div>
          <div className="sp-card">
            <div style={{ fontWeight: 900, fontSize: 14, color: "var(--sp-muted)" }}>B/W vs Color</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, gap: 12 }}>
              <div>
                <div className="sp-badge" style={{ background: "rgba(31,111,235,0.1)" }}>
                  <span style={{ width: 10, height: 10, background: "#1f6feb", borderRadius: 999 }} />
                  B/W: {stats?.printsByType?.["B/W"] ?? 0}
                </div>
              </div>
              <div>
                <div className="sp-badge" style={{ background: "rgba(59,188,217,0.15)" }}>
                  <span style={{ width: 10, height: 10, background: "#3bbcd9", borderRadius: 999 }} />
                  Color: {stats?.printsByType?.Color ?? 0}
                </div>
              </div>
            </div>
          </div>
          <div className="sp-card">
            <div style={{ fontWeight: 900, fontSize: 14, color: "var(--sp-muted)" }}>Trust Score</div>
            <div style={{ fontWeight: 1000, fontSize: 34, marginTop: 8 }}>{trustScore}</div>
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  height: 12,
                  borderRadius: 999,
                  border: "1px solid var(--sp-border)",
                  background: "rgba(255,255,255,0.6)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.max(0, Math.min(100, trustScore))}%`,
                    background:
                      trustScore >= 60
                        ? "linear-gradient(90deg, rgba(31,111,235,0.95) 0%, rgba(59,188,217,0.95) 100%)"
                        : "linear-gradient(90deg, rgba(239,68,68,0.95) 0%, rgba(31,111,235,0.65) 100%)",
                    transition: "width 0.35s ease",
                  }}
                />
              </div>
              <div style={{ marginTop: 8, fontWeight: 800, color: "var(--sp-muted)" }}>
                Reduced after suspicious activity alerts
              </div>
            </div>
          </div>
        </div>

        <div className="sp-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
            <div>
              <h3 style={{ margin: 0 }}>Charts</h3>
              <div style={{ color: "var(--sp-muted)", fontWeight: 800 }}>B/W vs Color + Prints trend</div>
            </div>
            <button className="sp-btn sp-btn-secondary" type="button" onClick={loadStats}>
              Refresh
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PieChart values={stats?.printsByType || { "B/W": 0, Color: 0 }} />
            </div>
            <div>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Bar Chart (Prints)</div>
              <BarChart data={stats?.printsByDay || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

