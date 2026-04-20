import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../../services/authStorage";
import { api } from "../../services/api";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import {
  Users,
  Printer,
  BarChart2,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  ScrollText,
  Star,
  Bell,
  Settings,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  Mic,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import RatingsSection from "../../components/admin/RatingsSection";
import VoicePanel from "../../components/admin/VoicePanel";

/* ── Premium Noise grain overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.68"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Subtle Dot-grid background ── */
const GridDots = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, rgba(255, 107, 53, 0.3) 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity: 0.03,
    }}
  />
);

/* ── Soft Ambient glow orb ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{
      scale: [1, 1.1, 1.05, 1.15, 1],
      opacity: [0.08, 0.12, 0.1, 0.15, 0.08],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
      times: [0, 0.25, 0.5, 0.75, 1],
    }}
  />
);

/* ── Premium Stat Card ── */
const StatCard = ({
  icon: Icon,
  label,
  value,
  accent = "#FF6B35",
  delay = 0,
  children,
  trend,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative backdrop-blur-xl border rounded-2xl p-6 overflow-hidden"
    style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)",
    }}
  >
    <div
      className="absolute top-0 left-0 right-0 h-[1px]"
      style={{
        background: `linear-gradient(to right, ${accent}, transparent)`,
      }}
    />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{
              background: `${accent}15`,
              border: `1px solid ${accent}30`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: accent }} />
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: "#999999", fontFamily: '"Inter", sans-serif' }}
          >
            {label}
          </span>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? "text-green-400" : "text-red-400"}`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div
        className="text-3xl font-bold mb-2"
        style={{
          color: "#EAEAEA",
          fontFamily: '"Clash Display", "Inter", sans-serif',
          fontWeight: 700,
        }}
      >
        {value}
      </div>
      {children}
    </div>
  </motion.div>
);

export default function AdminDashboardNew() {
  const navigate = useNavigate();
  const auth = useMemo(() => getAuth(), []);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trustScore, setTrustScore] = useState(() =>
    typeof getAuth()?.trustScore === "number"
      ? getAuth().trustScore
      : auth?.trustScore || 0,
  );

  const [realTimeStats, setRealTimeStats] = useState(null);
  const [earningsHistory, setEarningsHistory] = useState(null);
  const [realTimeLoading, setRealTimeLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [chartData, setChartData] = useState([]);
  const [dateFilter, setDateFilter] = useState("7days");
  const [chartLoading, setChartLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");

  // ── FIX: ratingsKey MUST be inside the component function ──
  // Previously it was placed at line 56, outside the component,
  // which causes a "Rules of Hooks" crash. Moved here correctly.
  const [ratingsKey, setRatingsKey] = useState(0);

  // Voice requests state
  const [voiceRequests, setVoiceRequests] = useState([]);
  const [voiceRequestsLoading, setVoiceRequestsLoading] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const fetchVoiceRequests = async () => {
    setVoiceRequestsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/voice-requests", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const data = await res.json();
      setVoiceRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load voice requests:", err);
      setVoiceRequests([]);
    } finally {
      setVoiceRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "voice") {
      fetchVoiceRequests();
      const interval = setInterval(fetchVoiceRequests, 15000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // ── FIX: socket listener now also bumps ratingsKey so
  //    RatingsSection re-fetches whenever stats-updated fires ──
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("stats-updated", () => {
      loadRealTimeStats();
      loadEarningsHistory();
      setRatingsKey((k) => k + 1); // triggers RatingsSection refresh
    });
    return () => socket.disconnect();
  }, []);

  const updateVoiceRequestStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/voice-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchVoiceRequests();
    } catch (err) {
      console.error("Failed to update voice request:", err);
    }
  };

  const getVoiceStatusStyle = (status) => {
    if (status === "printed")
      return {
        bg: "rgba(34,197,94,0.1)",
        border: "rgba(34,197,94,0.3)",
        text: "#22c55e",
      };
    if (status === "rejected")
      return {
        bg: "rgba(239,68,68,0.1)",
        border: "rgba(239,68,68,0.3)",
        text: "#ef4444",
      };
    return {
      bg: "rgba(255,107,53,0.1)",
      border: "rgba(255,107,53,0.3)",
      text: "#FF6B35",
    };
  };

  if (error && !stats) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#fff",
          background: "#1a1a1a",
          minHeight: "100vh",
        }}
      >
        <h1>Admin Dashboard Error</h1>
        <p>Something went wrong loading the dashboard:</p>
        <pre
          style={{
            background: "#2a2a2a",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {error.toString()}
        </pre>
        <button
          onClick={() => setError(null)}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#FF6B35",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  async function loadStats() {
    setError("");
    setLoading(true);
    try {
      const api = (await import("../../services/api")).api;
      const res = await api.get("/stats");
      setStats(res.data);
      if (typeof res.data?.trustScore === "number") {
        setTrustScore(res.data.trustScore);
        const currentAuth = getAuth();
        const newAuth = { ...currentAuth, trustScore: res.data.trustScore };
        localStorage.setItem("auth", JSON.stringify(newAuth));
      }
      await loadChartData(dateFilter);
    } catch (err) {
      console.log(err);
      setError("Failed to load dashboard data");
      setStats({
        totalUsers: 0,
        totalPrints: 0,
        activeTokens: 0,
        trustScore: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadRealTimeStats() {
    setRealTimeLoading(true);
    try {
      const api = (await import("../../services/api")).api;
      const response = await api.get("/realtime-stats");
      setRealTimeStats(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load real-time stats:", err);
      setRealTimeStats({
        totalPrints: 0,
        bwPrints: 0,
        colorPrints: 0,
        totalEarnings: 0,
        currency: "₹",
      });
    } finally {
      setRealTimeLoading(false);
    }
  }

  async function loadEarningsHistory() {
    try {
      const api = (await import("../../services/api")).api;
      const response = await api.get("/earnings-history");
      setEarningsHistory(response.data);
    } catch (err) {
      console.error("Failed to load earnings history:", err);
      setEarningsHistory({
        today: { totalEarnings: 0, totalPrints: 0, currency: "₹" },
        yesterday: { totalEarnings: 0, totalPrints: 0, currency: "₹" },
        last7Days: { totalEarnings: 0, totalPrints: 0, currency: "₹" },
      });
    }
  }

  async function loadPrintHistory() {
    try {
      const api = (await import("../../services/api")).api;
      const response = await api.get("/print-history");
      const historyData = response.data;
      const tableBody = document.getElementById("historyTableBody");
      if (!tableBody) return;

      if (historyData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-gray-400">No print history available</td></tr>`;
        return;
      }

      tableBody.innerHTML = historyData
        .map((record) => {
          const price =
            record.price ||
            record.pages *
              (record.printType === "Color" ? 5 : 2) *
              (record.copies || 1);
          const timestamp = record.timestamp || record.createdAt || new Date();
          return `
            <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td class="py-3 px-4 text-gray-300">${new Date(timestamp).toLocaleString()}</td>
              <td class="py-3 px-4 text-gray-300">
                <div class="text-white">${record.userName || record.user || "Unknown"}</div>
                <div class="text-xs text-gray-500">${record.userEmail || "N/A"}</div>
              </td>
              <td class="py-3 px-4 text-gray-300">${record.filename || "Unknown"}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${record.printType === "Color" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-gray-500/20 text-gray-400 border border-gray-500/30"}">
                  ${record.printType}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-300">${record.pages || 1}</td>
              <td class="py-3 px-4 text-gray-300">${record.copies || 1}</td>
              <td class="py-3 px-4 text-right font-medium text-green-400">₹${Number(price || 0).toFixed(2)}</td>
            </tr>
          `;
        })
        .join("");
    } catch (err) {
      console.error("Failed to load print history:", err);
      const tableBody = document.getElementById("historyTableBody");
      if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-red-400">Failed to load history. Please try again.</td></tr>`;
      }
    }
  }

  async function loadChartData(filter) {
    setChartLoading(true);
    try {
      const res = await api.get(`/stats/charts?filter=${filter}`);
      setChartData(res.data);
    } catch (err) {
      console.error("Failed to load chart data:", err);
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }

  // Initial data load
  useEffect(() => {
    loadStats();
    loadRealTimeStats();
    loadEarningsHistory();
  }, []);

  // Real-time stats auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      loadRealTimeStats();
      loadEarningsHistory();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Stats + charts refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      loadStats();
      loadChartData(dateFilter);
    }, 60000);
    return () => clearInterval(interval);
  }, [dateFilter]);

  // Reload charts when filter changes
  useEffect(() => {
    if (stats) loadChartData(dateFilter);
  }, [dateFilter, stats]);

  // Load print history when tab opens
  useEffect(() => {
    if (activeTab === "history") loadPrintHistory();
  }, [activeTab]);

  try {
    return (
      <div
        className="relative min-h-screen overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <NoiseSVG />
        <GridDots />
        <GlowOrb color="#FF6B35" size={600} top="-10%" left="-5%" delay={0} />
        <GlowOrb color="#FF8A50" size={400} top="40%" left="60%" delay={3} />

        {/* ── Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-0 top-0 h-full w-64 z-20"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="p-2 rounded-xl"
                style={{
                  background: "rgba(255, 107, 53, 0.15)",
                  border: "1px solid rgba(255, 107, 53, 0.3)",
                }}
              >
                <ShieldCheck className="w-5 h-5" style={{ color: "#FF6B35" }} />
              </div>
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif',
                    fontWeight: 700,
                  }}
                >
                  Admin
                </h1>
                <p className="text-xs" style={{ color: "#999999" }}>
                  PrivyPrint
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
                { key: "ratings", icon: Star, label: "Ratings" },
                { key: "history", icon: CalendarIcon, label: "History" },
              ].map(({ key, icon: Icon, label }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab(key);
                    // ── FIX: bump ratingsKey each time the Ratings
                    //    tab is clicked so RatingsSection remounts
                    //    and re-fetches fresh data ──
                    if (key === "ratings") setRatingsKey((k) => k + 1);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                  style={{
                    background:
                      activeTab === key
                        ? "rgba(255, 107, 53, 0.1)"
                        : "rgba(255,255,255,0.03)",
                    border:
                      activeTab === key
                        ? "1px solid rgba(255, 107, 53, 0.2)"
                        : "1px solid rgba(255,255,255,0.08)",
                    color: activeTab === key ? "#FF6B35" : "#999999",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </motion.button>
              ))}

              {/* Voice Print — separate to show badge */}
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("voice")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background:
                    activeTab === "voice"
                      ? "rgba(255, 107, 53, 0.1)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    activeTab === "voice"
                      ? "1px solid rgba(255, 107, 53, 0.2)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color: activeTab === "voice" ? "#FF6B35" : "#999999",
                }}
              >
                <Mic className="w-4 h-4" />
                <span className="text-sm font-medium">Voice Print</span>
                {voiceRequests.filter((r) => r.status === "pending").length >
                  0 && (
                  <span
                    className="ml-auto text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,107,53,0.2)",
                      color: "#FF6B35",
                      border: "1px solid rgba(255,107,53,0.3)",
                    }}
                  >
                    {voiceRequests.filter((r) => r.status === "pending").length}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/print")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#999999",
                }}
              >
                <Printer className="w-4 h-4" />
                <span className="text-sm font-medium">Print Panel</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/logs")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#999999",
                }}
              >
                <ScrollText className="w-4 h-4" />
                <span className="text-sm font-medium">Print Logs</span>
              </motion.button>
            </nav>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute bottom-6 left-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* ── Main Content ── */}
        <div className="ml-64 p-8">
          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{
                  color: "#EAEAEA",
                  fontFamily: '"Clash Display", "Inter", sans-serif',
                  fontWeight: 700,
                }}
              >
                {activeTab === "dashboard" && "Dashboard"}
                {activeTab === "ratings" && "Ratings & Reviews"}
                {activeTab === "history" && "History"}
                {activeTab === "voice" && "Voice Print"}
                {activeTab === "print-panel" && "Print Panel"}
                {activeTab === "logs" && "Print Logs"}
              </h1>
              <p style={{ color: "#999999" }}>
                {activeTab === "dashboard" &&
                  `Welcome back, ${auth?.name || "Admin"}`}
                {activeTab === "ratings" &&
                  "Manage customer ratings and feedback"}
                {activeTab === "history" &&
                  "Track uploads, tokens, and prints by date"}
                {activeTab === "voice" &&
                  "Manage voice print requests and verify tokens"}
                {activeTab === "print-panel" && "Manage print jobs and tokens"}
                {activeTab === "logs" && "View system logs and activities"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#999999",
                }}
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#999999",
                }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════
              DASHBOARD TAB
          ════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={stats?.totalUsers || "0"}
                  accent="#FF6B35"
                  delay={0.1}
                />
                <StatCard
                  icon={Printer}
                  label="Total Prints"
                  value={stats?.totalPrints || "0"}
                  accent="#FF8A50"
                  delay={0.2}
                />
                <StatCard
                  icon={BarChart2}
                  label="Active Tokens"
                  value={stats?.activeTokens || "0"}
                  accent="#FFA05B"
                  delay={0.3}
                />
                <StatCard
                  icon={ShieldCheck}
                  label="Trust Score"
                  value={trustScore}
                  accent="#FF6B35"
                  delay={0.4}
                />
              </div>

              {/* Real-Time Print Tracking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#FF6B35]" />
                      Real-Time Print Tracking
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {lastUpdated
                        ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                        : "Loading..."}
                    </p>
                  </div>
                  {realTimeLoading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF6B35]" />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">
                        Today's Prints
                      </h3>
                      <Printer className="w-4 h-4 text-[#FF6B35]" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {realTimeStats?.totalPrints || 0}
                    </div>
                  </div>
                  <div className="backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">
                        B/W Prints
                      </h3>
                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {realTimeStats?.bwPrints || 0}
                    </div>
                  </div>
                  <div className="backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">
                        Color Prints
                      </h3>
                      <div className="w-3 h-3 bg-orange-400 rounded-full" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {realTimeStats?.colorPrints || 0}
                    </div>
                  </div>
                  <div className="backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">
                        Today's Earnings
                      </h3>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {realTimeStats?.currency || "₹"}
                      {realTimeStats?.totalEarnings || 0}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Earnings Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#FFA05B]" />
                    Earnings Dashboard
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      key: "today",
                      label: "Today",
                      badge: "Live",
                      badgeColor: "text-green-400",
                    },
                    {
                      key: "yesterday",
                      label: "Yesterday",
                      badge: "Completed",
                      badgeColor: "text-gray-400",
                    },
                    {
                      key: "last7Days",
                      label: "Last 7 Days",
                      badge: "Total",
                      badgeColor: "text-blue-400",
                    },
                  ].map(({ key, label, badge, badgeColor }) => (
                    <div
                      key={key}
                      className="backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-400">
                          {label}
                        </h3>
                        <div className={`text-xs ${badgeColor}`}>{badge}</div>
                      </div>
                      <div className="text-2xl font-bold text-white mb-2">
                        {earningsHistory?.[key]?.currency || "₹"}
                        {earningsHistory?.[key]?.totalEarnings || 0}
                      </div>
                      <div className="text-sm text-gray-400">
                        {earningsHistory?.[key]?.totalPrints || 0} prints
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Date Filter + Charts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    Activity Overview
                  </h2>
                  <div className="flex gap-2">
                    {["today", "7days", "30days"].map((filter) => (
                      <motion.button
                        key={filter}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDateFilter(filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dateFilter === filter ? "bg-[#FF6B35] text-white" : "bg-white/10 text-gray-400 hover:bg-white/20"}`}
                      >
                        {filter === "today"
                          ? "Today"
                          : filter === "7days"
                            ? "7 Days"
                            : "30 Days"}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {chartLoading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                      >
                        <div className="flex items-center justify-center h-64">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-[#FF6B35]" /> Print
                          Activity
                        </h3>
                        {chartData.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span>Live</span>
                          </div>
                        )}
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                          />
                          <XAxis
                            dataKey="date"
                            stroke="#999999"
                            tick={{ fill: "#999999", fontSize: 12 }}
                          />
                          <YAxis
                            stroke="#999999"
                            tick={{ fill: "#999999", fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a1a",
                              border: "1px solid rgba(255,107,53,0.3)",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="prints"
                            stroke="#FF6B35"
                            strokeWidth={3}
                            dot={{ fill: "#FF6B35", r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="users"
                            stroke="#FF8A50"
                            strokeWidth={2}
                            dot={{ fill: "#FF8A50", r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-[#FFA05B]" /> Daily
                          Print Volume
                        </h3>
                        <div className="text-xs text-gray-400">
                          {dateFilter === "today"
                            ? "Today"
                            : dateFilter === "7days"
                              ? "Last 7 Days"
                              : "Last 30 Days"}
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                          />
                          <XAxis
                            dataKey="date"
                            stroke="#999999"
                            tick={{ fill: "#999999", fontSize: 12 }}
                          />
                          <YAxis
                            stroke="#999999"
                            tick={{ fill: "#999999", fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1a1a1a",
                              border: "1px solid rgba(255,107,53,0.3)",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="prints"
                            fill="#FF6B35"
                            radius={[8, 8, 0, 0]}
                          />
                          <Bar
                            dataKey="uploads"
                            fill="#FFA05B"
                            radius={[8, 8, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </>
          )}

          {/* ════════════════════════════════════════
              RATINGS TAB
              key={ratingsKey}        → remounts component on every tab
                                        click and on every socket event,
                                        forcing a fresh data fetch
              refreshTrigger={ratingsKey} → in case RatingsSection uses
                                        a useEffect([refreshTrigger]) pattern
          ════════════════════════════════════════ */}
          {activeTab === "ratings" && (
            <RatingsSection key={ratingsKey} refreshTrigger={ratingsKey} />
          )}

          {/* ════════════════════════════════════════
              VOICE TAB
          ════════════════════════════════════════ */}
          {activeTab === "voice" && (
            <>
              <VoicePanel />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <div
                  className="relative backdrop-blur-xl border rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      background:
                        "linear-gradient(to right, #FF6B35, transparent)",
                    }}
                  />

                  <div className="relative z-10 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            background: "rgba(255,107,53,0.15)",
                            border: "1px solid rgba(255,107,53,0.3)",
                          }}
                        >
                          <Mic
                            className="w-4 h-4"
                            style={{ color: "#FF6B35" }}
                          />
                        </div>
                        <div>
                          <h3
                            className="text-lg font-semibold"
                            style={{
                              color: "#EAEAEA",
                              fontFamily: '"Clash Display", sans-serif',
                            }}
                          >
                            Live Voice Requests
                          </h3>
                          <p className="text-xs" style={{ color: "#999999" }}>
                            {
                              voiceRequests.filter(
                                (r) => r.status === "pending",
                              ).length
                            }{" "}
                            pending
                            {" · "}
                            {voiceRequests.length} total
                            {" · "}auto-refreshes every 15s
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchVoiceRequests}
                        className="p-2 rounded-xl"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#999999",
                        }}
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${voiceRequestsLoading ? "animate-spin" : ""}`}
                        />
                      </motion.button>
                    </div>

                    {/* Body */}
                    {voiceRequestsLoading && voiceRequests.length === 0 ? (
                      <div className="flex items-center justify-center py-20">
                        <RefreshCw
                          className="w-5 h-5 animate-spin mr-3"
                          style={{ color: "#FF6B35" }}
                        />
                        <span style={{ color: "#999999" }}>
                          Fetching recordings…
                        </span>
                      </div>
                    ) : voiceRequests.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Mic
                          className="w-14 h-14 mb-4 opacity-20"
                          style={{ color: "#FF6B35" }}
                        />
                        <p
                          className="text-lg font-medium mb-2"
                          style={{ color: "#999999" }}
                        >
                          No voice logs found
                        </p>
                        <p className="text-sm" style={{ color: "#666666" }}>
                          Requests appear here when customers use the Voice
                          Print feature
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {voiceRequests.map((req) => {
                          const s = getVoiceStatusStyle(req.status);
                          const isPending = req.status === "pending";

                          return (
                            <motion.div
                              key={req._id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start justify-between gap-4 p-4 rounded-xl"
                              style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                              }}
                            >
                              {/* Left */}
                              <div className="flex flex-col gap-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-[10px] font-black uppercase tracking-widest"
                                    style={{ color: "#999999" }}
                                  >
                                    Token
                                  </span>
                                  <span
                                    className="text-lg font-black tracking-widest"
                                    style={{ color: "#EAEAEA" }}
                                  >
                                    {req.token || "N/A"}
                                  </span>
                                </div>

                                <p
                                  className="text-sm font-medium"
                                  style={{ color: "#EAEAEA" }}
                                >
                                  {req.transcript
                                    ? `"${req.transcript}"`
                                    : "No transcript available"}
                                </p>

                                <div className="flex items-center gap-1 mt-1">
                                  <Clock
                                    className="w-3 h-3"
                                    style={{ color: "#666666" }}
                                  />
                                  <span
                                    className="text-xs"
                                    style={{ color: "#666666" }}
                                  >
                                    {new Date(
                                      req.requestedAt || req.createdAt,
                                    ).toLocaleString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>

                              {/* Right */}
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <span
                                  className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                                  style={{
                                    background: s.bg,
                                    border: `1px solid ${s.border}`,
                                    color: s.text,
                                  }}
                                >
                                  {req.status}
                                </span>

                                {isPending && (
                                  <div className="flex gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() =>
                                        updateVoiceRequestStatus(
                                          req._id,
                                          "printed",
                                        )
                                      }
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                                      style={{
                                        background: "rgba(34,197,94,0.1)",
                                        border: "1px solid rgba(34,197,94,0.3)",
                                        color: "#22c55e",
                                      }}
                                    >
                                      <CheckCircle className="w-3 h-3" /> Mark
                                      Printed
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() =>
                                        updateVoiceRequestStatus(
                                          req._id,
                                          "rejected",
                                        )
                                      }
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                                      style={{
                                        background: "rgba(239,68,68,0.1)",
                                        border: "1px solid rgba(239,68,68,0.3)",
                                        color: "#ef4444",
                                      }}
                                    >
                                      <AlertCircle className="w-3 h-3" /> Reject
                                    </motion.button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* ════════════════════════════════════════
              HISTORY TAB
          ════════════════════════════════════════ */}
          {activeTab === "history" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    Print History
                  </h2>
                  <button
                    onClick={loadPrintHistory}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white/10 text-gray-400 hover:bg-white/20"
                  >
                    Refresh
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {[
                          "Date & Time",
                          "User",
                          "File Name",
                          "Type",
                          "Pages",
                          "Copies",
                          "Price",
                        ].map((h) => (
                          <th
                            key={h}
                            className={`${h === "Price" ? "text-right" : "text-left"} py-3 px-4 text-gray-400 font-medium`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody id="historyTableBody">
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-8 text-gray-400"
                        >
                          Loading history...
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "print-panel" && (
            <div className="text-center py-12">
              <p style={{ color: "#999999" }}>Redirecting to Print Panel...</p>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="text-center py-12">
              <p style={{ color: "#999999" }}>Redirecting to Logs...</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.error("Dashboard error:", err);
    return (
      <div
        style={{
          padding: "20px",
          color: "#fff",
          background: "#1a1a1a",
          minHeight: "100vh",
        }}
      >
        <h1>Dashboard Error</h1>
        <pre>{err.toString()}</pre>
      </div>
    );
  }
}
