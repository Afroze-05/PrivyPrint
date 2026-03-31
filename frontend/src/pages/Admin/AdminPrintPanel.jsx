import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ShieldCheck, AlertTriangle, LayoutDashboard, Printer,
  FileText, Clock, Cpu, ChevronRight, CheckCircle, XCircle, Eye } from "lucide-react";
import { api, apiBaseUrl, authHeader } from "../../services/api";
import { getAuth, setAuth } from "../../services/authStorage";
import CameraPermissionModal from "../../components/CameraPermissionModal";
import SecurityOverlay from "../../components/SecurityOverlay";
import PhoneDetection from "../../components/security/PhoneDetection";
import { motion, AnimatePresence } from "framer-motion";

function formatWatermarkTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/* ── Noise grain overlay ── */
const NoiseSVG = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Dot-grid background ── */
const GridDots = () => (
  <div className="absolute inset-0 pointer-events-none"
    style={{ backgroundImage: `radial-gradient(circle, #D91828 1px, transparent 1px)`, backgroundSize: "36px 36px", opacity: 0.05 }} />
);

/* ── Ambient glow orb ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
    transition={{ duration: 7, repeat: Infinity, delay, ease: "easeInOut" }} />
);

/* ── Scan-line sweep ── */
const ScanLine = () => (
  <motion.div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D91828]/20 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
);

/* ── Panel wrapper ── */
const Panel = ({ children, accent = "#3BBCD9", className = "" }) => (
  <div className={`relative bg-[#0E1A21] border border-white/6 overflow-hidden ${className}`}
    style={{ clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)" }}>
    <div className="absolute top-0 left-0 right-0 h-[2px]"
      style={{ background: `linear-gradient(to right, ${accent}, transparent)` }} />
    <div className="absolute top-0 right-0 w-[22px] h-[22px] border-t border-r"
      style={{ borderColor: `${accent}35` }} />
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at top left, ${accent}06 0%, transparent 60%)` }} />
    <div className="relative z-10">{children}</div>
  </div>
);

/* ── Nav button ── */
const NavBtn = ({ onClick, icon: Icon, label, accent = "#3BBCD9" }) => (
  <motion.button type="button" onClick={onClick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
    className="relative overflow-hidden group flex items-center gap-2 px-5 py-2.5 border border-white/8 text-white/40 hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-[0.3em]"
    style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = `${accent}50`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    <Icon className="w-3.5 h-3.5 relative z-10" />
    <span className="relative z-10">{label}</span>
  </motion.button>
);

/* ── Section label ── */
const SectionLabel = ({ children, accent = "#3BBCD9" }) => (
  <div className="flex items-center gap-3 mb-3">
    <div className="h-px w-6" style={{ background: accent }} />
    <span className="text-[9px] font-black tracking-[0.5em] text-white/30 uppercase">{children}</span>
  </div>
);

export default function AdminPrintPanel() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [tokenInput, setTokenInput] = useState("");
  const [doc, setDoc] = useState(null);
  const [watermarkTime, setWatermarkTime] = useState(null);

  const [loadingDoc, setLoadingDoc] = useState(false);
  const [error, setError] = useState("");

  const [secondsLeft, setSecondsLeft] = useState(120);
  const [intervalActive, setIntervalActive] = useState(false);

  const [isPrinting, setIsPrinting] = useState(false);
  const [printMessage, setPrintMessage] = useState("");
  const [printedSuccess, setPrintedSuccess] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const [trustScore, setTrustScore] = useState(() =>
    typeof getAuth()?.trustScore === "number" ? getAuth().trustScore : 0
  );
  const [popup, setPopup] = useState(null);

  const [cameraStream, setCameraStream] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  const auth = useMemo(() => getAuth(), []);

  useEffect(() => {
    return () => { if (cameraStream) cameraStream.getTracks().forEach(t => t.stop()); };
  }, [cameraStream]);

  const handleCameraGranted = (stream) => {
    setCameraStream(stream);
    setShowCameraModal(false);
    setIsCameraActive(true);
  };

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      const id = setInterval(() => {
        setIsFaceDetected(cameraStream.active);
      }, 2000);
      return () => clearInterval(id);
    }
  }, [cameraStream]);

  useEffect(() => {
    if (!intervalActive) return;
    const id = window.setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [intervalActive]);

  useEffect(() => {
    if (secondsLeft === 0 && intervalActive) {
      setIntervalActive(false);
      setTokenInvalid(true);
    }
  }, [secondsLeft, intervalActive]);

  function showPopup(message) {
    setPopup({ message });
    window.setTimeout(() => setPopup(null), 3000);
  }

  async function handleFetchDocument() {
    setError(""); setPrintedSuccess(false); setTokenInvalid(false); setDoc(null);
    const token = tokenInput.trim();
    if (!token) { setError("Token is required."); return; }
    const currentAuth = getAuth();
    if (!currentAuth?.token) { navigate("/admin/login"); return; }
    setLoadingDoc(true);
    try {
      const res = await api.get(`/document/${encodeURIComponent(token)}`, { headers: authHeader(currentAuth.token) });
      setDoc(res.data);
      setWatermarkTime(new Date());
      setSecondsLeft(120);
      setIntervalActive(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch document.");
      setDoc(null); setIntervalActive(false);
    } finally {
      setLoadingDoc(false);
    }
  }

  async function handlePrint() {
    setError("");
    if (!doc?.token) { setError("Fetch document first."); return; }
    if (tokenInvalid || isPrinting) return;
    const currentAuth = getAuth();
    setIsPrinting(true); setPrintMessage("");
    try {
      await api.post(`/print/${encodeURIComponent(doc.token)}`, null, { headers: authHeader(currentAuth.token) });
      const today = new Date().toISOString().split("T")[0];
      const allStats = JSON.parse(localStorage.getItem("privyprint_local_stats") || "{}");
      const dayStats = allStats[today] || { bw: 0, color: 0, total: 0 };
      if (doc.type === "B/W") dayStats.bw += 1;
      else if (doc.type === "Color") dayStats.color += 1;
      dayStats.total += 1;
      allStats[today] = dayStats;
      localStorage.setItem("privyprint_local_stats", JSON.stringify(allStats));
      window.dispatchEvent(new Event("localStatsUpdated"));

      setPrintedSuccess(false);
      const messages = ["Printing page 1...", "Printing page 2...", "Printing page 3..."];
      messages.forEach((msg, i) => window.setTimeout(() => setPrintMessage(msg), i * 900));
      window.setTimeout(() => {
        setPrintMessage("Printed Successfully");
        setPrintedSuccess(true);
        setTokenInvalid(true);
        setIntervalActive(false);
        setIsPrinting(false);
      }, messages.length * 900 + 250);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Print failed.");
      setIsPrinting(false);
    }
  }

  async function handleAlert() {
    setError("");
    const currentAuth = getAuth();
    if (!currentAuth?.token) return navigate("/admin/login");
    const token = (doc?.token || tokenInput).trim();
    if (!token) { setError("Enter a token first."); return; }
    const types = ["mobile_detected", "multiple_faces"];
    const type = types[Math.floor(Math.random() * types.length)];
    try {
      const res = await api.post("/alert", { type, token }, { headers: authHeader(currentAuth.token) });
      if (typeof res.data?.trustScore === "number") {
        const updated = { ...currentAuth, trustScore: res.data.trustScore };
        setAuth(updated);
        setTrustScore(res.data.trustScore);
      }
      showPopup("Suspicious Activity Detected");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Alert simulation failed.");
    }
  }

  const watermarkText = doc?.token && watermarkTime
    ? `${doc.token} | ${formatWatermarkTime(watermarkTime)}` : "";
  const tokenPreviewStatus = tokenInvalid || secondsLeft === 0 ? "Token Expired" : "Waiting";
  const trustColor = trustScore >= 60 ? "#3BBCD9" : "#D91828";
  const timerPct = (secondsLeft / 120) * 100;
  const timerColor = secondsLeft > 60 ? "#3BBCD9" : secondsLeft > 30 ? "#D9910D" : "#D91828";

  return (
    <div className="relative min-h-screen bg-[#0C1519] font-sans overflow-x-hidden">
      <SecurityOverlay />
      <PhoneDetection existingVideoRef={videoRef} />
      {showCameraModal && <CameraPermissionModal onPermissionGranted={handleCameraGranted} />}

      <NoiseSVG />
      <GridDots />
      <ScanLine />
      <GlowOrb color="#D91828" size={500} top="-8%" left="-5%" delay={0} />
      <GlowOrb color="#3BBCD9" size={380} top="40%" left="65%" delay={2} />
      <GlowOrb color="#D9910D" size={260} top="70%" left="15%" delay={4} />

      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D91828]/30 to-transparent" />
      <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D91828]/20 to-transparent" />
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D9910D]/15 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col gap-5">

        {/* ── Top Nav Bar ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative bg-[#0E1A21] border border-white/6 px-6 py-4 overflow-hidden"
          style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D91828] via-[#D9910D] to-[#3BBCD9]" />
          <div className="absolute top-0 right-0 w-[20px] h-[20px] border-t border-r border-[#D91828]/30" />

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-[#D91828]/10 border border-[#D91828]/20">
                <Printer className="w-5 h-5 text-[#D91828]" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white uppercase tracking-widest leading-none"
                  style={{ fontFamily: '"BlockForce", monospace' }}>
                  Print <span className="text-[#D91828]" style={{ textShadow: "0 0 20px rgba(217,24,40,0.4)" }}>Panel</span>
                </h1>
                <p className="text-[9px] font-black tracking-[0.5em] text-white/25 uppercase mt-0.5">
                  Secure Viewing · Token Validation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Trust score badge */}
              <div className="flex items-center gap-2 px-4 py-2 border border-white/6 bg-white/2"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}>
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: trustColor }} />
                <span className="text-[9px] font-black tracking-[0.35em] text-white/30 uppercase">Trust</span>
                <span className="text-sm font-black" style={{ fontFamily: '"BlockForce", monospace', color: trustColor }}>
                  {trustScore}
                </span>
              </div>

              {/* Camera preview inline badge */}
              {isCameraActive && (
                <div className="relative w-32 h-20 border border-[#3BBCD9]/30 overflow-hidden bg-black"
                  style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}>
                  <video ref={videoRef} autoPlay playsInline muted
                    style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-black/60">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: isFaceDetected ? "#3BBCD9" : "#D91828" }} />
                    <span className="text-[8px] font-black tracking-widest text-white/70 uppercase">
                      {isFaceDetected ? "Face OK" : "No Face"}
                    </span>
                  </div>
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#3BBCD9]/60 to-transparent" />
                </div>
              )}

              <NavBtn onClick={() => navigate("/admin/dashboard")} icon={LayoutDashboard} label="Dashboard" accent="#3BBCD9" />
            </div>
          </div>
        </motion.div>

        {/* ── Token input row ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
          <Panel accent="#3BBCD9">
            <div className="p-6 flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <SectionLabel accent="#3BBCD9">Enter Token</SectionLabel>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Eye className="w-4 h-4 text-white/20 group-focus-within:text-[#3BBCD9] transition-colors duration-300" />
                  </div>
                  <input
                    className="w-full bg-[#0C1519] border border-white/8 text-white text-sm font-black placeholder:text-white/20
                      focus:outline-none focus:border-[#3BBCD9]/50 transition-all duration-300 py-4 pr-4 pl-11 tracking-widest"
                    style={{ fontFamily: '"BlockForce", monospace', clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                    value={tokenInput}
                    onChange={e => setTokenInput(e.target.value)}
                    placeholder="SPX-1234"
                    disabled={isPrinting}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#3BBCD9]/0 group-focus-within:bg-[#3BBCD9]/50 transition-all duration-300" />
                </div>
              </div>
              <motion.button type="button" onClick={handleFetchDocument} disabled={loadingDoc || isPrinting}
                whileHover={{ scale: loadingDoc || isPrinting ? 1 : 1.02 }}
                whileTap={{ scale: loadingDoc || isPrinting ? 1 : 0.97 }}
                className="relative overflow-hidden group flex items-center gap-2 px-10 py-4 font-black uppercase tracking-[0.35em] text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #D91828 0%, #a81220 100%)", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                {loadingDoc ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full relative z-10" />
                ) : (
                  <FileText className="w-4 h-4 relative z-10" />
                )}
                <span className="relative z-10">{loadingDoc ? "Fetching..." : "Fetch Document"}</span>
              </motion.button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="mx-6 mb-5 flex items-center gap-2 px-4 py-3 border border-[#D91828]/30 bg-[#D91828]/8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D91828] flex-shrink-0" />
                <span className="text-[#D91828] text-xs font-bold">{error}</span>
              </motion.div>
            )}
          </Panel>
        </motion.div>

        {/* ── Main 2-col grid ── */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* ── Left: Document Preview ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
            <Panel accent="#3BBCD9" className="h-full">
              <div className="p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3BBCD9]/10 border border-[#3BBCD9]/20">
                      <FileText className="w-4 h-4 text-[#3BBCD9]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none"
                        style={{ fontFamily: '"BlockForce", monospace' }}>Document Preview</h3>
                      <p className="text-[9px] font-bold text-white/25 mt-0.5 uppercase tracking-widest">
                        {tokenInvalid ? "Token Expired" : "Secure Viewing Enabled"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border text-[9px] font-black uppercase tracking-[0.3em]"
                    style={{
                      borderColor: tokenInvalid ? "rgba(217,24,40,0.3)" : "rgba(59,188,217,0.25)",
                      background: tokenInvalid ? "rgba(217,24,40,0.06)" : "rgba(59,188,217,0.05)",
                      color: tokenInvalid ? "#D91828" : "#3BBCD9",
                      clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
                    }}>
                    {tokenInvalid ? <XCircle className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {tokenPreviewStatus}
                  </div>
                </div>

                {/* Preview area */}
                <div className="relative border border-white/6 bg-[#0C1519] overflow-hidden min-h-[280px] flex items-center justify-center"
                  style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)" }}>
                  {doc ? (
                    <>
                      {doc.fileUrl?.toLowerCase().endsWith(".pdf") ? (
                        <iframe title="Document Preview" src={`${apiBaseUrl}${doc.fileUrl}`}
                          style={{ width: "100%", height: 280, border: 0 }} />
                      ) : (
                        <img src={`${apiBaseUrl}${doc.fileUrl}`} alt="Document"
                          style={{ width: "100%", height: "auto", maxHeight: 280, objectFit: "contain", display: "block" }} />
                      )}
                      {watermarkText && (
                        <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none">
                          <div className="px-3 py-1.5 border border-dashed border-white/20 bg-black/40 backdrop-blur-sm text-[10px] font-black text-white/30 tracking-widest"
                            style={{ transform: "rotate(-4deg)", clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}>
                            {watermarkText}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center py-12">
                      <div className="p-4 bg-white/3 border border-white/6">
                        <FileText className="w-8 h-8 text-white/15" />
                      </div>
                      <p className="text-[10px] font-black tracking-[0.5em] text-white/20 uppercase">
                        Fetch a token to preview
                      </p>
                    </div>
                  )}
                </div>

                {/* Timer */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" style={{ color: timerColor }} />
                      <span className="text-[9px] font-black tracking-[0.45em] text-white/30 uppercase">Session Timer</span>
                    </div>
                    <span className="text-2xl font-black tracking-tight"
                      style={{ fontFamily: '"BlockForce", monospace', color: timerColor }}>
                      {secondsLeft}s
                    </span>
                  </div>
                  <div className="h-[5px] bg-white/6 overflow-hidden"
                    style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)" }}>
                    <motion.div className="h-full" style={{ background: timerColor, boxShadow: `0 0 8px ${timerColor}` }}
                      animate={{ width: `${timerPct}%` }} transition={{ duration: 0.5 }} />
                  </div>
                  <p className="text-[9px] font-bold text-white/20 mt-1.5 uppercase tracking-widest">
                    {tokenInvalid ? "Token Expired" : intervalActive ? "Countdown running..." : "Waiting for document fetch"}
                  </p>
                </div>

                {/* Camera monitor strip */}
                <div className="border border-white/5 bg-white/2 px-4 py-3 flex items-center gap-3"
                  style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}>
                  <div className="p-1.5 bg-[#3BBCD9]/10 border border-[#3BBCD9]/15">
                    <Camera className="w-4 h-4 text-[#3BBCD9]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black tracking-[0.4em] text-white/40 uppercase">Camera Monitoring Active</p>
                    <p className="text-[8px] font-bold text-white/20 mt-0.5 tracking-widest uppercase">🔐 Secure Viewing Enabled</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3BBCD9] animate-pulse shadow-[0_0_6px_#3BBCD9]" />
                    <span className="text-[8px] font-black text-[#3BBCD9]/50 uppercase tracking-widest">Live</span>
                  </div>
                </div>
              </div>
            </Panel>
          </motion.div>

          {/* ── Right: Print Function ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <Panel accent="#D91828" className="h-full">
              <div className="p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#D91828]/10 border border-[#D91828]/20">
                      <Printer className="w-4 h-4 text-[#D91828]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none"
                        style={{ fontFamily: '"BlockForce", monospace' }}>Print Function</h3>
                      <p className="text-[9px] font-bold text-white/25 mt-0.5 uppercase tracking-widest">
                        Token becomes invalid after use
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border text-[9px] font-black uppercase tracking-[0.3em]"
                    style={{
                      borderColor: tokenInvalid ? "rgba(217,24,40,0.3)" : "rgba(59,188,217,0.25)",
                      background: tokenInvalid ? "rgba(217,24,40,0.06)" : "rgba(59,188,217,0.05)",
                      color: tokenInvalid ? "#D91828" : "#3BBCD9",
                      clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
                    }}>
                    {tokenInvalid ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {tokenInvalid ? "Token Expired" : "Waiting"}
                  </div>
                </div>

                {/* Print button */}
                <motion.button type="button" onClick={handlePrint}
                  disabled={!doc?.token || tokenInvalid || isPrinting}
                  whileHover={{ scale: !doc?.token || tokenInvalid || isPrinting ? 1 : 1.02 }}
                  whileTap={{ scale: !doc?.token || tokenInvalid || isPrinting ? 1 : 0.97 }}
                  className="relative overflow-hidden group w-full py-5 font-black uppercase tracking-[0.5em] text-white text-base disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #D91828 0%, #a81220 100%)", clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)" }}>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isPrinting ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <Printer className="w-5 h-5" />
                    )}
                    Print
                  </span>
                </motion.button>

                {/* Print messages */}
                <div className="min-h-[72px] border border-white/5 bg-white/2 px-5 py-4 flex items-center"
                  style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}>
                  <AnimatePresence mode="wait">
                    {printedSuccess ? (
                      <motion.div key="success" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#3BBCD9] flex-shrink-0" style={{ filter: "drop-shadow(0 0 8px rgba(59,188,217,0.6))" }} />
                        <div>
                          <p className="text-sm font-black text-[#3BBCD9] uppercase tracking-wider">Printed Successfully</p>
                          <p className="text-[9px] text-white/25 font-bold tracking-widest mt-0.5 uppercase">Token Expired</p>
                        </div>
                      </motion.div>
                    ) : printMessage ? (
                      <motion.div key={printMessage} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-3">
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block w-4 h-4 border-2 border-white/20 border-t-[#D9910D] rounded-full flex-shrink-0" />
                        <span className="text-xs font-black text-white/60 uppercase tracking-widest">{printMessage}</span>
                      </motion.div>
                    ) : (
                      <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
                        {tokenInvalid ? "Token Expired — Cannot Print" : "Click PRINT to start secure sequence"}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-white/5" />

                {/* Simulate suspicious activity */}
                <div>
                  <SectionLabel accent="#D9910D">Security Simulation</SectionLabel>
                  <motion.button type="button" onClick={handleAlert}
                    disabled={isPrinting || !tokenInput.trim()}
                    whileHover={{ scale: isPrinting || !tokenInput.trim() ? 1 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden group w-full flex items-center justify-center gap-2 py-3.5 border border-[#D9910D]/25 text-[#D9910D]/60 hover:text-[#D9910D] hover:border-[#D9910D]/50 transition-all duration-300 text-[10px] font-black uppercase tracking-[0.35em] disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-[#D9910D]/8 to-transparent" />
                    <AlertTriangle className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Simulate Suspicious Activity</span>
                  </motion.button>
                  <p className="text-[9px] font-bold text-white/18 mt-2.5 leading-relaxed uppercase tracking-wider">
                    Reduces admin trust score · triggers email alert if configured
                  </p>
                </div>

                {/* Trust score bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5" style={{ color: trustColor }} />
                      <span className="text-[9px] font-black tracking-[0.45em] text-white/30 uppercase">Trust Score</span>
                    </div>
                    <span className="text-xl font-black" style={{ fontFamily: '"BlockForce", monospace', color: trustColor }}>
                      {trustScore}
                    </span>
                  </div>
                  <div className="h-[5px] bg-white/6 overflow-hidden"
                    style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)" }}>
                    <motion.div className="h-full"
                      style={{ background: `linear-gradient(to right, ${trustColor}, ${trustColor}aa)`, boxShadow: `0 0 8px ${trustColor}` }}
                      animate={{ width: `${Math.max(0, Math.min(100, trustScore))}%` }}
                      transition={{ duration: 0.5 }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] font-black text-white/15 uppercase tracking-widest">0</span>
                    <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: `${trustColor}80` }}>
                      {trustScore >= 60 ? "Trusted" : "At Risk"}
                    </span>
                    <span className="text-[8px] font-black text-white/15 uppercase tracking-widest">100</span>
                  </div>
                </div>
              </div>
            </Panel>
          </motion.div>
        </div>
      </div>

      {/* ── Popup toast ── */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 border border-[#D91828]/40 bg-[#0C1519]/95 backdrop-blur-md"
            style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D91828] to-[#D9910D]" />
            <AlertTriangle className="w-4 h-4 text-[#D91828] flex-shrink-0" style={{ filter: "drop-shadow(0 0 8px rgba(217,24,40,0.6))" }} />
            <div>
              <p className="text-sm font-black text-white uppercase tracking-wider">{popup.message}</p>
              <p className="text-[9px] text-white/30 font-bold tracking-widest mt-0.5 uppercase">Trust score decreased</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating status indicator */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 border border-[#D91828]/20 bg-[#0C1519]/90 backdrop-blur-md"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}>
        <span className="text-[10px] font-black text-[#D91828] uppercase tracking-[0.35em]">System Live</span>
        <div className="w-2.5 h-2.5 bg-[#D91828] rounded-full animate-pulse shadow-[0_0_10px_#D91828]" />
      </motion.div>
    </div>
  );
}