import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { getAuth, clearAuth, setAuth } from "../../services/authStorage";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import SecurityOverlay from "../../components/SecurityOverlay";
import PrintStatsChart from "../../components/charts/PrintStatsChart";
import { motion } from "framer-motion";
import {
  Users, Printer, BarChart2, ShieldCheck,
  LogOut, Cpu, LayoutDashboard, ScrollText,
} from "lucide-react";

/* ── Noise grain overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Dot-grid background ── */
const GridDots = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, #D91828 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity: 0.05,
    }}
  />
);

/* ── Ambient glow orb ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
    transition={{ duration: 7, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, accent = "#3BBCD9", delay = 0, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative bg-[#0E1A21] border border-white/6 p-6 overflow-hidden"
    style={{ clipPath: "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)" }}
  >
    <div className="absolute top-0 left-0 right-0 h-[2px]"
      style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
    <div className="absolute top-0 right-0 w-[18px] h-[18px] border-t border-r"
      style={{ borderColor: `${accent}40` }} />
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at top left, ${accent}08 0%, transparent 65%)` }} />

    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 border" style={{ background: `${accent}10`, borderColor: `${accent}20` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">{label}</span>
      </div>
      <div
        className="text-4xl font-black text-white tracking-tighter mb-1"
        style={{ fontFamily: '"BlockForce", monospace' }}
      >
        {value}
      </div>
      {children}
    </div>

    <div className="absolute bottom-3 right-4 text-[9px] font-black text-white/6 tracking-widest uppercase">
      Live
    </div>
  </motion.div>
);

/* ── Section panel ── */
const Panel = ({ title, icon: Icon, accent = "#3BBCD9", delay = 0, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative bg-[#0E1A21] border border-white/6 p-6 overflow-hidden"
    style={{ clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)" }}
  >
    <div className="absolute top-0 left-0 right-0 h-[2px]"
      style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
    <div className="absolute top-0 right-0 w-[22px] h-[22px] border-t border-r"
      style={{ borderColor: `${accent}35` }} />
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at top left, ${accent}06 0%, transparent 60%)` }} />

    <div className="relative z-10">
      {title && (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          {Icon && (
            <div className="p-2 border" style={{ background: `${accent}10`, borderColor: `${accent}20` }}>
              <Icon className="w-4 h-4" style={{ color: accent }} />
            </div>
          )}
          <div>
            <h3
              className="text-sm font-black text-white uppercase tracking-widest"
              style={{ fontFamily: '"BlockForce", monospace' }}
            >
              {title}
            </h3>
          </div>
        </div>
      )}
      {children}
    </div>
  </motion.div>
);

/* ── Nav button ── */
const NavBtn = ({ onClick, icon: Icon, label, accent = "#3BBCD9" }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="relative overflow-hidden group flex items-center gap-2 px-5 py-2.5 border border-white/8 text-white/40 hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-[0.3em]"
    style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}50`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
  >
    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    <Icon className="w-3.5 h-3.5 relative z-10" />
    <span className="relative z-10">{label}</span>
  </motion.button>
);

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
        const currentAuth = getAuth();
        setAuth({ ...currentAuth, trustScore: res.data.trustScore });
      }
    } catch (err) {
      console.log(err);
      console.warn("API failed, using fallback.");
      const today = new Date().toISOString().split("T")[0];
      const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
      const dayStats = allStats[today] || { bw: 0, color: 0, total: 0 };
      setStats(prev => ({
        ...prev,
        totalPrints: dayStats.total,
        printsByType: { "B/W": dayStats.bw, Color: dayStats.color },
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
      const today = new Date().toISOString().split("T")[0];
      const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
      const dayStats = allStats[today];
      if (dayStats) {
        setStats(prev => ({
          ...prev,
          totalPrints: dayStats.total,
          printsByType: { "B/W": dayStats.bw, Color: dayStats.color },
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

  const trustColor = trustScore > 60 ? "#3BBCD9" : "#D91828";

  return (
    <div className="relative min-h-screen bg-[#0C1519] font-sans overflow-x-hidden">
      <SecurityOverlay />
      <NoiseSVG />
      <GridDots />
      <GlowOrb color="#D91828" size={500} top="-8%" left="-5%" delay={0} />
      <GlowOrb color="#3BBCD9" size={380} top="40%" left="65%" delay={2} />
      <GlowOrb color="#D9910D" size={260} top="70%" left="15%" delay={4} />

      {/* Edge rules */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D91828]/30 to-transparent" />
      <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D91828]/20 to-transparent" />
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D9910D]/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* ── Top Nav Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-[#0E1A21] border border-white/6 px-6 py-4 mb-6 overflow-hidden"
          style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D91828] via-[#D9910D] to-[#3BBCD9]" />
          <div className="absolute top-0 right-0 w-[20px] h-[20px] border-t border-r border-[#D91828]/30" />

          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: brand + title */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#D91828]/10 border border-[#D91828]/20">
                <ShieldCheck className="w-5 h-5 text-[#D91828]" />
              </div>
              <div>
                <h1
                  className="text-xl font-black text-white uppercase tracking-widest leading-none"
                  style={{ fontFamily: '"BlockForce", monospace' }}
                >
                  Admin <span className="text-[#D91828]" style={{ textShadow: "0 0 20px rgba(217,24,40,0.4)" }}>Dashboard</span>
                </h1>
                <p className="text-[9px] font-black tracking-[0.5em] text-white/25 uppercase mt-0.5">
                  Analytics + Trust Score
                </p>
              </div>
            </div>

            {/* Right: nav buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <NavBtn onClick={() => navigate("/admin/print")} icon={Printer} label="Print Panel" accent="#3BBCD9" />
              <NavBtn onClick={() => navigate("/admin/logs")} icon={ScrollText} label="Print Logs" accent="#D9910D" />
              <motion.button
                type="button"
                onClick={handleLogout}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden group flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                style={{
                  background: "linear-gradient(135deg, #D91828 0%, #a81220 100%)",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <LogOut className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Error / Loading ── */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 border border-[#D91828]/30 bg-[#D91828]/8 mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#D91828] flex-shrink-0" />
            <span className="text-[#D91828] text-xs font-bold">{error}</span>
          </motion.div>
        )}

        {loading && (
          <div className="flex items-center gap-3 mb-6 text-white/30">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-4 h-4 border-2 border-white/15 border-t-[#3BBCD9] rounded-full"
            />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase">Loading analytics...</span>
          </div>
        )}

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} accent="#3BBCD9" delay={0.1} />
          <StatCard icon={Printer} label="Total Prints" value={stats?.totalPrints ?? 0} accent="#D9910D" delay={0.15} />

          <StatCard icon={BarChart2} label="B/W vs Color" value="" accent="#3BBCD9" delay={0.2}>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-2xl font-black text-[#3BBCD9]"
                  style={{ fontFamily: '"BlockForce", monospace' }}
                >
                  {stats?.printsByType?.["B/W"] ?? 0}
                </span>
                <span className="text-[9px] font-black tracking-[0.35em] text-white/25 uppercase">B/W</span>
              </div>
              <div className="w-[1px] h-8 bg-white/8" />
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-2xl font-black text-[#D9910D]"
                  style={{ fontFamily: '"BlockForce", monospace' }}
                >
                  {stats?.printsByType?.Color ?? 0}
                </span>
                <span className="text-[9px] font-black tracking-[0.35em] text-white/25 uppercase">Color</span>
              </div>
            </div>
          </StatCard>

          <StatCard icon={ShieldCheck} label="Trust Score" value={trustScore} accent={trustColor} delay={0.25}>
            <div className="mt-3">
              <div className="h-[5px] bg-white/6 overflow-hidden" style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)" }}>
                <motion.div
                  className="h-full"
                  style={{ background: trustColor, boxShadow: `0 0 8px ${trustColor}` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${trustScore}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] font-black text-white/15 uppercase tracking-widest">0</span>
                <span className="text-[8px] font-black tracking-widest uppercase" style={{ color: `${trustColor}80` }}>
                  {trustScore > 60 ? "Trusted" : "At Risk"}
                </span>
                <span className="text-[8px] font-black text-white/15 uppercase tracking-widest">100</span>
              </div>
            </div>
          </StatCard>
        </div>

        {/* ── Live Analytics Chart ── */}
        <Panel title="Real-Time Print Analytics" icon={BarChart2} accent="#3BBCD9" delay={0.3}>
          <PrintStatsChart />
        </Panel>

        {/* ── Static Charts ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6"
        >
          <Panel title="Print Type Distribution" icon={Printer} accent="#D9910D" delay={0.45}>
            <PieChart values={stats?.printsByType || { "B/W": 0, Color: 0 }} />
          </Panel>
          <Panel title="Prints by Day" icon={BarChart2} accent="#3BBCD9" delay={0.5}>
            <BarChart data={stats?.printsByDay || []} />
          </Panel>
        </motion.div>

      </div>

      {/* Floating status indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 border border-[#D91828]/20 bg-[#0C1519]/90 backdrop-blur-md"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
      >
        <span className="text-[10px] font-black text-[#D91828] uppercase tracking-[0.35em]">
          System Live
        </span>
        <div className="w-2.5 h-2.5 bg-[#D91828] rounded-full animate-pulse shadow-[0_0_10px_#D91828]" />
      </motion.div>
    </div>
  );
}