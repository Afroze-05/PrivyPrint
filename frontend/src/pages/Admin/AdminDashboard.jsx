// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../services/api";
// import { getAuth, clearAuth } from "../../services/authStorage";
// import PieChart from "../../components/charts/PieChart";
// import BarChart from "../../components/charts/BarChart";
// import SecurityOverlay from "../../components/SecurityOverlay";
// import PrintStatsChart from "../../components/charts/PrintStatsChart";

// export default function AdminDashboard() {
//   const navigate = useNavigate();

//   const auth = useMemo(() => getAuth(), []);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [trustScore, setTrustScore] = useState(() => (typeof getAuth()?.trustScore === "number" ? getAuth().trustScore : auth?.trustScore || 0));

//   async function loadStats() {
//     setError("");
//     setLoading(true);
//     try {
//       const token = getAuth()?.token;
//       const res = await api.get("/stats", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStats(res.data);
//       if (typeof res.data?.trustScore === "number") setTrustScore(res.data.trustScore);
//     } catch (err) {
//       console.warn("Analytics API failed, using local stats fallback.", err);
//       // Suppress "Failed to fetch" error for user as requested
//       // Fallback: If API fails, we still have the local chart working below.
//       // We can also try to populate some stats from localStorage if they exist.
//       const today = new Date().toISOString().split("T")[0];
//       const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
//       const dayStats = allStats[today] || { bw: 0, color: 0, total: 0 };
      
//       setStats(prev => ({
//         ...prev,
//         totalPrints: dayStats.total,
//         printsByType: { "B/W": dayStats.bw, Color: dayStats.color }
//       }));
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadStats();
//     // Keep trust score and local stats in sync
//     const syncLocalData = () => {
//       const next = getAuth()?.trustScore;
//       if (typeof next === "number") setTrustScore(next);
      
//       // If we are currently showing local fallback or if we just want it to be snappy
//       const today = new Date().toISOString().split("T")[0];
//       const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
//       const dayStats = allStats[today];
//       if (dayStats) {
//         setStats(prev => ({
//           ...prev,
//           totalPrints: dayStats.total,
//           printsByType: { "B/W": dayStats.bw, Color: dayStats.color }
//         }));
//       }
//     };

//     syncLocalData();
//     window.addEventListener("storage", syncLocalData);
//     window.addEventListener("localStatsUpdated", syncLocalData);

//     return () => {
//       window.removeEventListener("storage", syncLocalData);
//       window.removeEventListener("localStatsUpdated", syncLocalData);
//     };
//   }, []);

//   function handleLogout() {
//     clearAuth();
//     navigate("/");
//   }

//   return (
//     <div className="sp-page secure-content">
//       <SecurityOverlay />
//       <div className="sp-container">
//         <div className="sp-card" style={{ marginBottom: 16 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
//             <div>
//               <h2 style={{ marginTop: 0 }}>Admin Dashboard</h2>
//               <div style={{ color: "var(--sp-muted)", fontWeight: 800 }}>
//                 Analytics + Trust Score
//               </div>
//             </div>
//             <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//               <button className="sp-btn sp-btn-secondary" onClick={() => navigate("/admin/print")} type="button">
//                 Print Panel
//               </button>
//               <button className="sp-btn sp-btn-secondary" onClick={() => navigate("/admin/logs")} type="button">
//                 Print Logs
//               </button>
//               <button className="sp-btn sp-btn-secondary" onClick={handleLogout} type="button">
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {error ? <div style={{ color: "#ef4444", fontWeight: 800, marginBottom: 16 }}>{error}</div> : null}

//         {loading ? <div style={{ fontWeight: 900 }}>Loading analytics...</div> : null}

//         <div className="sp-grid-2" style={{ marginBottom: 16 }}>
//           <div className="sp-card">
//             <div style={{ fontWeight: 900, fontSize: 14, color: "var(--sp-muted)" }}>Total Users</div>
//             <div style={{ fontWeight: 1000, fontSize: 34 }}>{stats?.totalUsers ?? 0}</div>
//           </div>
//           <div className="sp-card">
//             <div style={{ fontWeight: 900, fontSize: 14, color: "var(--sp-muted)" }}>Total Prints</div>
//             <div style={{ fontWeight: 1000, fontSize: 34 }}>{stats?.totalPrints ?? 0}</div>
//           </div>
//           <div className="sp-card">
//             <div style={{ fontWeight: 900, fontSize: 14, color: "var(--sp-muted)" }}>B/W vs Color</div>
//             <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, gap: 12 }}>
//               <div>
//                 <div className="sp-badge" style={{ background: "rgba(31,111,235,0.1)" }}>
//                   <span style={{ width: 10, height: 10, background: "#1f6feb", borderRadius: 999 }} />
//                   B/W: {stats?.printsByType?.["B/W"] ?? 0}
//                 </div>
//               </div>
//               <div>
//                 <div className="sp-badge" style={{ background: "rgba(59,188,217,0.15)" }}>
//                   <span style={{ width: 10, height: 10, background: "#3bbcd9", borderRadius: 999 }} />
//                   Color: {stats?.printsByType?.Color ?? 0}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="sp-card">
//             <div style={{ fontWeight: 900, fontSize: 14, color: "var(--sp-muted)" }}>Trust Score</div>
//             <div style={{ fontWeight: 1000, fontSize: 34, marginTop: 8 }}>{trustScore}</div>
//             <div style={{ marginTop: 10 }}>
//               <div
//                 style={{
//                   height: 12,
//                   borderRadius: 999,
//                   border: "1px solid var(--sp-border)",
//                   background: "rgba(255,255,255,0.6)",
//                   overflow: "hidden",
//                 }}
//               >
//                 <div
//                   style={{
//                     height: "100%",
//                     width: `${Math.max(0, Math.min(100, trustScore))}%`,
//                     background:
//                       trustScore >= 60
//                         ? "linear-gradient(90deg, rgba(31,111,235,0.95) 0%, rgba(59,188,217,0.95) 100%)"
//                         : "linear-gradient(90deg, rgba(239,68,68,0.95) 0%, rgba(31,111,235,0.65) 100%)",
//                     transition: "width 0.35s ease",
//                   }}
//                 />
//               </div>
//               <div style={{ marginTop: 8, fontWeight: 800, color: "var(--sp-muted)" }}>
//                 Reduced after suspicious activity alerts
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="sp-card" style={{ marginBottom: 16 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
//             <div>
//               <h3 style={{ margin: 0 }}>Real-Time Print Analytics</h3>
//               <div style={{ color: "var(--sp-muted)", fontWeight: 800 }}>Live updates for B/W, Color, and Total prints</div>
//             </div>
//             <div className="sp-badge" style={{ color: "var(--sp-blue)", borderColor: "var(--sp-blue)", background: "rgba(31,111,235,0.05)" }}>
//               <div className="animate-pulse" style={{ width: 8, height: 8, background: "var(--sp-blue)", borderRadius: "50%" }}></div>
//               Live
//             </div>
//           </div>
//           <PrintStatsChart />
//         </div>

//         <div className="sp-card">
//           <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
//             <div>
//               <h3 style={{ margin: 0 }}>Charts</h3>
//               <div style={{ color: "var(--sp-muted)", fontWeight: 800 }}>B/W vs Color + Prints trend</div>
//             </div>
//             <button className="sp-btn sp-btn-secondary" type="button" onClick={loadStats}>
//               Refresh
//             </button>
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
//             <div style={{ display: "flex", justifyContent: "center" }}>
//               <PieChart values={stats?.printsByType || { "B/W": 0, Color: 0 }} />
//             </div>
//             <div>
//               <div style={{ fontWeight: 900, marginBottom: 10 }}>Bar Chart (Prints)</div>
//               <BarChart data={stats?.printsByDay || []} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
// Added setAuth to the import below
import { getAuth, clearAuth, setAuth } from "../../services/authStorage"; 
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import SecurityOverlay from "../../components/SecurityOverlay";
import PrintStatsChart from "../../components/charts/PrintStatsChart";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const auth = useMemo(() => getAuth(), []);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trustScore, setTrustScore] = useState(() => 
    typeof getAuth()?.trustScore === "number" ? getAuth().trustScore : auth?.trustScore || 0
  );

  async function loadStats() {
    setError("");
    setLoading(true);
    try {
      const token = getAuth()?.token;
      const res = await api.get("/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setStats(res.data);
      
      if (typeof res.data?.trustScore === "number") {
        setTrustScore(res.data.trustScore);
        // Syncing the score back to local storage session
        const currentAuth = getAuth();
        setAuth({ ...currentAuth, trustScore: res.data.trustScore });
      }
    } catch (err) {
      console.log(err)
      console.warn("API failed, using fallback.");
      // Fallback: Using local stats if the backend is down
      const today = new Date().toISOString().split("T")[0];
      const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
      const dayStats = allStats[today] || { bw: 0, color: 0, total: 0 };
      
      setStats(prev => ({
        ...prev,
        totalPrints: dayStats.total,
        printsByType: { "B/W": dayStats.bw, Color: dayStats.color }
      }));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();

    const syncData = () => {
      const next = getAuth()?.trustScore;
      if (typeof next === "number") setTrustScore(next);
      
      // Update stats from local storage if updated by the camera/print logic
      const today = new Date().toISOString().split("T")[0];
      const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
      const dayStats = allStats[today];
      if (dayStats) {
        setStats(prev => ({
          ...prev,
          totalPrints: dayStats.total,
          printsByType: { "B/W": dayStats.bw, Color: dayStats.color }
        }));
      }
    };

    window.addEventListener("storage", syncData);
    window.addEventListener("localStatsUpdated", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("localStatsUpdated", syncData);
    };
  }, []);

  function handleLogout() {
    clearAuth();
    navigate("/");
  }

  return (
    <div className="sp-page secure-content">
      <SecurityOverlay />
      <div className="sp-container">
        {/* Header Card */}
        <div className="sp-card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ marginTop: 0 }}>Admin Dashboard</h2>
              <div style={{ color: "var(--sp-muted)", fontWeight: 800 }}>Analytics + Trust Score</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button className="sp-btn sp-btn-secondary" onClick={() => navigate("/admin/print")}>Print Panel</button>
              <button className="sp-btn sp-btn-secondary" onClick={() => navigate("/admin/logs")}>Print Logs</button>
              <button className="sp-btn sp-btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>

        {error && <div style={{ color: "#ef4444", fontWeight: 800, marginBottom: 16 }}>{error}</div>}
        {loading && <div style={{ fontWeight: 900 }}>Loading analytics...</div>}

        {/* Stats Grid */}
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
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <div className="sp-badge">B/W: {stats?.printsByType?.["B/W"] ?? 0}</div>
              <div className="sp-badge">Color: {stats?.printsByType?.Color ?? 0}</div>
            </div>
          </div>

          <div className="sp-card">
            <div style={{ fontWeight: 900, fontSize: 14, color: "var(--sp-muted)" }}>Trust Score</div>
            <div style={{ fontWeight: 1000, fontSize: 34 }}>{trustScore}</div>
            <div style={{ height: 12, borderRadius: 999, border: "1px solid #ddd", marginTop: 10, overflow: "hidden" }}>
              <div 
                style={{ 
                  height: "100%", 
                  width: `${trustScore}%`, 
                  background: trustScore > 60 ? "#1f6feb" : "#ef4444",
                  transition: "width 0.4s ease" 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Live Analytics Chart */}
        <div className="sp-card" style={{ marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Real-Time Print Analytics</h3>
          <PrintStatsChart />
        </div>

        {/* Static Charts */}
        <div className="sp-card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <PieChart values={stats?.printsByType || { "B/W": 0, Color: 0 }} />
            <BarChart data={stats?.printsByDay || []} />
          </div>
        </div>
      </div>
    </div>
  );
}