import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { getAuth } from "../../services/authStorage";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScrollText, LayoutDashboard, RefreshCw, Cpu,
  ArrowLeft, Key, Copy, Printer, Clock, CheckCircle,
  AlertCircle, Loader, Inbox, Search, Filter, FileText,
  Calendar, Activity, X
} from "lucide-react";

function formatTime(value) {
  try {
    const d = new Date(value);
    return d.toLocaleString([], {
      hour: "2-digit", minute: "2-digit",
      year: "numeric", month: "short", day: "2-digit",
    });
  } catch (_e) {
    return String(value);
  }
}

/* ── Premium Noise grain overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Premium Dot-grid background ── */
const GridDots = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, rgba(255, 107, 53, 0.15) 1px, transparent 1px)`,
      backgroundSize: "40px 40px",
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
      opacity: [0.05, 0.08, 0.06, 0.12, 0.05] 
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

/* ── Premium Glass Card ── */
const GlassCard = ({ children, className = "", accent = "#FF6B35" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative backdrop-blur-xl border rounded-2xl overflow-hidden ${className}`}
    style={{
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)"
    }}
  >
    <div className="absolute top-0 left-0 right-0 h-[1px]"
      style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

/* ── Status Badge ── */
const StatusBadge = ({ status }) => {
  const s = (status ?? "completed").toLowerCase();
  const map = {
    completed: { color: "#22c55e", icon: CheckCircle, label: "Printed", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
    waiting:   { color: "#FFA05B", icon: Loader,       label: "Pending",  bg: "rgba(255,160,91,0.1)", border: "rgba(255,160,91,0.2)" },
    failed:    { color: "#ef4444", icon: AlertCircle,   label: "Failed",   bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
    printed:   { color: "#22c55e", icon: CheckCircle,   label: "Printed",  bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
  };
  const { color, icon: Icon, label, bg, border } = map[s] || map.completed;
  
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
      style={{
        background: bg,
        borderColor: border,
        color: color,
        border: `1px solid ${border}`,
        fontFamily: '"Inter", sans-serif'
      }}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
};

/* ── Type Badge ── */
const TypeBadge = ({ type }) => {
  const isColor = (type ?? "").toLowerCase() === "color";
  const color = isColor ? "#FFA05B" : "#FF6B35";
  const bg = isColor ? "rgba(255,160,91,0.1)" : "rgba(255,107,53,0.1)";
  const border = isColor ? "rgba(255,160,91,0.2)" : "rgba(255,107,53,0.2)";
  
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
      style={{
        background: bg,
        borderColor: border,
        color: color,
        border: `1px solid ${border}`,
        fontFamily: '"Inter", sans-serif'
      }}
    >
      <Printer className="w-3.5 h-3.5" />
      {type ?? "-"}
    </div>
  );
};

/* ── Premium Input Field ── */
const PremiumInput = ({ 
  icon: Icon, 
  value, 
  onChange, 
  placeholder, 
  accent = "#FF6B35"
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300" 
        style={{ color: focused ? accent : "rgba(255,255,255,0.3)" }} />
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent border text-white rounded-xl py-3 pr-4 pl-12 text-sm font-medium transition-all duration-300 placeholder:text-white/20"
        style={{
          fontFamily: '"Inter", sans-serif',
          border: focused ? `1px solid ${accent}` : "1px solid rgba(255,255,255,0.1)",
          boxShadow: focused ? `0 0 20px ${accent}20` : "none",
          background: "rgba(255,255,255,0.02)"
        }}
      />
    </div>
  );
};

/* ── Log Card Component ── */
const LogCard = ({ log, index }) => {
  return (
    <motion.div
      key={`${log.token}-${log.time}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.08, 
        duration: 0.5, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(255,107,53,0.15)"
      }}
      className="relative backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
      }}
    >
      {/* Accent line on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-transparent via-[#FF6B35] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="flex items-start justify-between gap-6">
        {/* Left Content */}
        <div className="flex-1 space-y-4">
          {/* Token and Type Row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4" style={{ color: "#FF6B35" }} />
              <span 
                className="text-sm font-mono font-medium tracking-wider"
                style={{ 
                  color: "#EAEAEA",
                  fontFamily: '"Clash Display", "Inter", sans-serif'
                }}
              >
                {log.token}
              </span>
            </div>
            <TypeBadge type={log.type} />
          </div>

          {/* Status and Time Row */}
          <div className="flex items-center gap-4 flex-wrap">
            <StatusBadge status={log.status} />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                {formatTime(log.time)}
              </span>
            </div>
          </div>

          {/* Copies Info */}
          {log.copies && (
            <div className="flex items-center gap-2">
              <Copy className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
                {log.copies} {log.copies === 1 ? "Copy" : "Copies"}
              </span>
            </div>
          )}
        </div>

        {/* Right Icon */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="p-3 rounded-xl"
          style={{ background: "rgba(255,107,53,0.1)" }}
        >
          <Printer className="w-5 h-5" style={{ color: "#FF6B35" }} />
        </motion.div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
    </motion.div>
  );
};

export default function PrintLogsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  async function loadLogs() {
    setError("");
    setLoading(true);
    setSpinning(true);
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
      setTimeout(() => setSpinning(false), 600);
    }
  }

  useEffect(() => { loadLogs(); }, []);

  // Filter and search logic
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = searchTerm === "" || 
        log.token?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.type?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === "all" || 
        log.status?.toLowerCase() === filterStatus.toLowerCase();
      
      return matchesSearch && matchesFilter;
    });
  }, [logs, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const printed = filteredLogs.filter(l => l.status?.toLowerCase() === 'printed' || l.status?.toLowerCase() === 'completed').length;
    const pending = filteredLogs.filter(l => l.status?.toLowerCase() === 'waiting').length;
    const failed = filteredLogs.filter(l => l.status?.toLowerCase() === 'failed').length;
    
    return { total, printed, pending, failed };
  }, [filteredLogs]);

  return (
    <div 
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
        fontFamily: '"Inter", sans-serif'
      }}
    >
      <NoiseSVG />
      <GridDots />
      <GlowOrb color="#FF6B35" size={600} top="-10%" left="-5%" delay={0} />
      <GlowOrb color="#FF8A50" size={400} top="40%" left="60%" delay={3} />
      <GlowOrb color="#FFA05B" size={260} top="70%" left="15%" delay={4} />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl backdrop-blur-xl border"
              style={{ 
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.1)"
              }}>
              <ScrollText className="w-5 h-5" style={{ color: "#FF6B35" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1" style={{
                color: "#EAEAEA",
                fontFamily: '"Clash Display", "Inter", sans-serif',
                fontWeight: 700
              }}>
                Print Logs
              </h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                Track all printing activities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/dashboard")}
              className="p-3 rounded-xl backdrop-blur-xl border transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.1)"
              }}
            >
              <LayoutDashboard className="w-5 h-5" style={{ color: "rgba(255,255,255,0.7)" }} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadLogs}
              className="relative overflow-hidden group px-6 py-3 rounded-xl font-medium text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #FF6B35dd 100%)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(255,107,53,0.3)",
                fontFamily: '"Inter", sans-serif'
              }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <motion.div
                animate={{ rotate: spinning ? 360 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="inline-block"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              <span className="ml-2">Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard accent="#FF6B35">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Total Logs
                  </p>
                  <p className="text-2xl font-bold" style={{ 
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif'
                  }}>
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,107,53,0.1)" }}>
                  <Activity className="w-5 h-5" style={{ color: "#FF6B35" }} />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard accent="#22c55e">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Printed
                  </p>
                  <p className="text-2xl font-bold" style={{ 
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif'
                  }}>
                    {stats.printed}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(34,197,94,0.1)" }}>
                  <CheckCircle className="w-5 h-5" style={{ color: "#22c55e" }} />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard accent="#FFA05B">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Pending
                  </p>
                  <p className="text-2xl font-bold" style={{ 
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif'
                  }}>
                    {stats.pending}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(255,160,91,0.1)" }}>
                  <Loader className="w-5 h-5" style={{ color: "#FFA05B" }} />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard accent="#ef4444">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Failed
                  </p>
                  <p className="text-2xl font-bold" style={{ 
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif'
                  }}>
                    {stats.failed}
                  </p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <AlertCircle className="w-5 h-5" style={{ color: "#ef4444" }} />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Search and Filter Bar */}
        <GlassCard accent="#FF6B35" className="mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <PremiumInput
                  icon={Search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by token or type..."
                  accent="#FF6B35"
                />
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filterStatus === "all" 
                      ? "text-white" 
                      : "text-white/60 hover:text-white"
                  }`}
                  style={{
                    background: filterStatus === "all" 
                      ? "linear-gradient(135deg, #FF6B35 0%, #FF6B35dd 100%)"
                      : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  All
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterStatus("printed")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filterStatus === "printed" 
                      ? "text-white" 
                      : "text-white/60 hover:text-white"
                  }`}
                  style={{
                    background: filterStatus === "printed" 
                      ? "linear-gradient(135deg, #22c55e 0%, #22c55edd 100%)"
                      : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  Printed
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterStatus("waiting")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    filterStatus === "waiting" 
                      ? "text-white" 
                      : "text-white/60 hover:text-white"
                  }`}
                  style={{
                    background: filterStatus === "waiting" 
                      ? "linear-gradient(135deg, #FFA05B 0%, #FFA05Bdd 100%)"
                      : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  Pending
                </motion.button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl backdrop-blur-sm border"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              borderColor: "rgba(239, 68, 68, 0.2)"
            }}
          >
            <p className="text-sm font-medium" style={{ color: "#ef4444" }}>
              {error}
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white/20 border-t-[#FF6B35] rounded-full"
              />
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                Loading logs...
              </span>
            </div>
          </div>
        )}

        {/* Logs Grid */}
        {!loading && (
          <div className="space-y-6">
            {filteredLogs.length === 0 ? (
              <GlassCard accent="#FF6B35">
                <div className="p-12 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1], 
                      opacity: [0.5, 0.8, 0.5] 
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,107,53,0.1)" }}
                  >
                    <Inbox className="w-8 h-8" style={{ color: "#FF6B35" }} />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2" style={{
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif'
                  }}>
                    No print activity yet
                  </h3>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {searchTerm || filterStatus !== "all" 
                      ? "No logs match your search criteria" 
                      : "Print logs will appear here once users start printing documents"}
                  </p>
                </div>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredLogs.map((log, index) => (
                  <LogCard key={`${log.token}-${log.time}`} log={log} index={index} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Stats */}
        {filteredLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 p-6 rounded-xl backdrop-blur-sm border"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.05)"
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: "#FF6B35" }} />
                <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {filteredLogs.length} {filteredLogs.length === 1 ? "Record" : "Records"}
                </span>
              </div>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                PrivyPrint Log System
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Status Indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-3 rounded-xl backdrop-blur-xl border"
        style={{
          background: "rgba(0,0,0,0.9)",
          borderColor: "rgba(255,107,53,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)"
        }}
      >
        <span className="text-sm font-medium" style={{ color: "#FF6B35" }}>
          System Live
        </span>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-3 h-3 rounded-full"
          style={{ background: "#FF6B35", boxShadow: "0 0 15px #FF6B35" }}
        />
      </motion.div>
    </div>
  );
}