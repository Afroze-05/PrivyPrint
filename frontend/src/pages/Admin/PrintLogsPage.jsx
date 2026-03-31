import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { getAuth } from "../../services/authStorage";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScrollText, LayoutDashboard, RefreshCw, Cpu,
  ArrowLeft, Key, Copy, Printer, Clock, CheckCircle,
  AlertCircle, Loader, Inbox,
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

/* ── Scan-line sweep ── */
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D91828]/20 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
  />
);

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const s = (status ?? "completed").toLowerCase();
  const map = {
    completed: { color: "#3BBCD9", icon: CheckCircle, label: "Completed" },
    waiting:   { color: "#D9910D", icon: Loader,       label: "Waiting"   },
    failed:    { color: "#D91828", icon: AlertCircle,   label: "Failed"    },
    printed:   { color: "#3BBCD9", icon: Printer,       label: "Printed"   },
  };
  const { color, icon: Icon, label } = map[s] || map.completed;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 border text-[9px] font-black uppercase tracking-[0.3em]"
      style={{
        borderColor: `${color}30`,
        background: `${color}0d`,
        color,
        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
      }}
    >
      <Icon className="w-3 h-3" />
      {label}
    </div>
  );
};

/* ── Type badge ── */
const TypeBadge = ({ type }) => {
  const isColor = (type ?? "").toLowerCase() === "color";
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 border text-[9px] font-black uppercase tracking-[0.3em]"
      style={{
        borderColor: isColor ? "rgba(217,145,13,0.3)" : "rgba(59,188,217,0.25)",
        background: isColor ? "rgba(217,145,13,0.06)" : "rgba(59,188,217,0.05)",
        color: isColor ? "#D9910D" : "#3BBCD9",
        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
      }}
    >
      <Printer className="w-3 h-3" />
      {type ?? "-"}
    </div>
  );
};

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

export default function PrintLogsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);
  const [spinning, setSpinning] = useState(false);

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

  const cols = [
    { key: "token",  label: "Token",  icon: Key    },
    { key: "copies", label: "Copies", icon: Copy   },
    { key: "type",   label: "Type",   icon: Printer },
    { key: "time",   label: "Time",   icon: Clock  },
    { key: "status", label: "Status", icon: CheckCircle },
  ];

  return (
    <div className="relative min-h-screen bg-[#0C1519] font-sans overflow-x-hidden">
      <NoiseSVG />
      <GridDots />
      <ScanLine />
      <GlowOrb color="#D91828" size={480} top="-8%" left="-5%" delay={0} />
      <GlowOrb color="#3BBCD9" size={360} top="45%" left="65%" delay={2} />
      <GlowOrb color="#D9910D" size={240} top="70%" left="12%" delay={4} />

      {/* Edge rules */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D91828]/30 to-transparent" />
      <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D91828]/20 to-transparent" />
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D9910D]/15 to-transparent" />

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
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#D91828]/10 border border-[#D91828]/20">
                <ScrollText className="w-5 h-5 text-[#D91828]" />
              </div>
              <div>
                <h1
                  className="text-xl font-black text-white uppercase tracking-widest leading-none"
                  style={{ fontFamily: '"BlockForce", monospace' }}
                >
                  Print <span className="text-[#D91828]" style={{ textShadow: "0 0 20px rgba(217,24,40,0.4)" }}>Logs</span>
                </h1>
                <p className="text-[9px] font-black tracking-[0.5em] text-white/25 uppercase mt-0.5">
                  Token · Copies · Type · Time · Status
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <NavBtn
                onClick={() => navigate("/admin/dashboard")}
                icon={LayoutDashboard}
                label="Dashboard"
                accent="#3BBCD9"
              />
              <motion.button
                type="button"
                onClick={loadLogs}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden group flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                style={{
                  background: "linear-gradient(135deg, #D91828 0%, #a81220 100%)",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <motion.div
                  animate={{ rotate: spinning ? 360 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </motion.div>
                <span className="relative z-10">Refresh</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Error ── */}
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

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center gap-3 mb-6 text-white/30">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-4 h-4 border-2 border-white/15 border-t-[#D91828] rounded-full"
            />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase">Loading logs...</span>
          </div>
        )}

        {/* ── Table panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative bg-[#0E1A21] border border-white/6 overflow-hidden"
          style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D91828] via-[#D9910D] to-transparent" />
          <div className="absolute top-0 right-0 w-[24px] h-[24px] border-t border-r border-[#D91828]/30" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top left, rgba(217,24,40,0.03) 0%, transparent 60%)" }} />

          {/* Table head */}
          <div className="relative z-10 grid grid-cols-5 gap-px border-b border-white/5 px-6 py-3">
            {cols.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center gap-2">
                <Icon className="w-3 h-3 text-white/20" />
                <span className="text-[9px] font-black tracking-[0.45em] text-white/25 uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Table rows */}
          <div className="relative z-10 divide-y divide-white/4">
            <AnimatePresence>
              {logs.length === 0 && !loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center gap-4 py-20 text-center"
                >
                  <div className="p-4 bg-white/3 border border-white/6">
                    <Inbox className="w-8 h-8 text-white/15" />
                  </div>
                  <p className="text-[10px] font-black tracking-[0.5em] text-white/20 uppercase">
                    No logs yet
                  </p>
                </motion.div>
              ) : (
                logs.map((l, i) => (
                  <motion.div
                    key={`${l.token}-${l.time}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                    className="group grid grid-cols-5 gap-px px-6 py-4 hover:bg-white/2 transition-colors duration-200 relative"
                  >
                    {/* Row left accent on hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#D91828]/0 group-hover:bg-[#D91828]/60 transition-colors duration-200" />

                    {/* Token */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="text-xs font-black text-white/70 truncate tracking-widest"
                        style={{ fontFamily: '"BlockForce", monospace' }}
                      >
                        {l.token}
                      </span>
                    </div>

                    {/* Copies */}
                    <div className="flex items-center">
                      <span
                        className="text-xl font-black text-white/80 leading-none"
                        style={{ fontFamily: '"BlockForce", monospace' }}
                      >
                        {l.copies ?? "-"}
                      </span>
                    </div>

                    {/* Type */}
                    <div className="flex items-center">
                      <TypeBadge type={l.type} />
                    </div>

                    {/* Time */}
                    <div className="flex items-center">
                      <span className="text-[10px] font-bold text-white/35 leading-tight">
                        {formatTime(l.time)}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <StatusBadge status={l.status} />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Footer count */}
          {logs.length > 0 && (
            <div className="relative z-10 px-6 py-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3BBCD9]" />
                <span className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">
                  {logs.length} {logs.length === 1 ? "Record" : "Records"}
                </span>
              </div>
              <span className="text-[9px] font-black tracking-[0.35em] text-white/12 uppercase">
                PrivyPrint Log System
              </span>
            </div>
          )}
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