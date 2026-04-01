import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ShieldCheck, AlertTriangle, LayoutDashboard, Printer,
  FileText, Clock, Cpu, ChevronRight, CheckCircle, XCircle, Eye, Key, Search, Filter } from "lucide-react";
import { api, apiBaseUrl, authHeader } from "../../services/api";
import { getAuth, setAuth } from "../../services/authStorage";
import CameraPermissionModal from "../../components/CameraPermissionModal";
import SecurityOverlay from "../../components/SecurityOverlay";
import PhoneDetection from "../../components/security/PhoneDetection";
import { motion, AnimatePresence } from "framer-motion";

function formatWatermarkTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/* ── Premium Noise grain overlay ── */
const NoiseSVG = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Premium Dot-grid background ── */
const GridDots = () => (
  <div className="absolute inset-0 pointer-events-none"
    style={{ 
      backgroundImage: `radial-gradient(circle, rgba(255, 107, 53, 0.15) 1px, transparent 1px)`,
      backgroundSize: "40px 40px",
      opacity: 0.03,
    }}
  />
);

/* ── Soft Ambient glow orb ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div className="absolute rounded-full blur-3xl pointer-events-none"
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

/* ── Premium Input Field ── */
const PremiumInput = ({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  type = "text",
  accent = "#FF6B35"
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value && value.length > 0);
  }, [value]);

  return (
    <div className="relative">
      {/* Floating Label */}
      <motion.label
        animate={{
          y: focused || hasValue ? -28 : 0,
          scale: focused || hasValue ? 0.85 : 1
        }}
        className="absolute left-4 text-sm font-medium pointer-events-none z-20 transition-all duration-300"
        style={{ 
          color: focused ? accent : "rgba(255,255,255,0.4)",
          fontFamily: '"Inter", sans-serif'
        }}
      >
        {label}
      </motion.label>
      
      {/* Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
        <Icon className="w-4 h-4 transition-colors duration-300" 
          style={{ color: focused ? accent : "rgba(255,255,255,0.3)" }} />
      </div>

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-transparent border text-white rounded-xl py-4 pr-4 pl-12 text-sm font-medium transition-all duration-300 placeholder:text-white/20"
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

/* ── Premium Button ── */
const PremiumButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  success = false,
  error = false,
  accent = "#FF6B35",
  className = ""
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`relative overflow-hidden group w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        background: success 
          ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
          : error 
          ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          : `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`,
        boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 20px ${accent}30`,
        fontFamily: '"Inter", sans-serif'
      }}
    >
      {/* Shine effect on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-3">
        {loading ? (
          <motion.span 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" 
          />
        ) : success ? (
          <CheckCircle className="w-5 h-5" />
        ) : error ? (
          <XCircle className="w-5 h-5" />
        ) : (
          <Printer className="w-5 h-5" />
        )}
        <span>{loading ? "Processing..." : children}</span>
      </span>

      {/* Success animation */}
      {success && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 rounded-xl bg-green-500/20"
        />
      )}

      {/* Error shake animation */}
      {error && (
        <motion.div
          animate={{ x: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 rounded-xl bg-red-500/10"
        />
      )}
    </motion.button>
  );
};

/* ── Status Card ── */
const StatusCard = ({ type, message, isVisible }) => {
  if (!isVisible) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';
  const accent = isSuccess ? "#22c55e" : isError ? "#ef4444" : "#FF6B35";
  const Icon = isSuccess ? CheckCircle : isError ? XCircle : Clock;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      className="relative backdrop-blur-xl border rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${accent}30`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${accent}20`
      }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ 
            scale: isSuccess ? [1, 1.2, 1] : [1, 1.1, 1],
            rotate: isSuccess ? [0, 5, -5, 0] : [0, 0, 0]
          }}
          transition={{ duration: 2, repeat: isSuccess ? Infinity : 0, ease: "easeInOut" }}
          className="p-3 rounded-full"
          style={{ background: `${accent}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: accent }} />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold mb-1" style={{ 
            color: "#EAEAEA",
            fontFamily: '"Clash Display", "Inter", sans-serif'
          }}>
            {message}
          </h3>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            {isSuccess ? "Document has been sent to printer" : isError ? "Please check token and try again" : "Processing your request..."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

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
  const [printStatus, setPrintStatus] = useState(null); // 'success', 'error', null
  const [showStatusCard, setShowStatusCard] = useState(false);

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
      setPrintStatus('error');
      setShowStatusCard(true);
    }
  }, [secondsLeft, intervalActive]);

  function showPopup(message) {
    setPopup({ message });
    window.setTimeout(() => setPopup(null), 3000);
  }

  async function handleFetchDocument() {
    setError(""); setPrintStatus(null); setShowStatusCard(false); setDoc(null);
    const token = tokenInput.trim();
    console.log('🔍 AdminPrintPanel - Verifying token:', token);
    if (!token) { setError("Token is required."); return; }
    const currentAuth = getAuth();
    if (!currentAuth?.token) { navigate("/admin/login"); return; }
    setLoadingDoc(true);
    try {
      const res = await fetch("/api/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(currentAuth.token)
        },
        body: JSON.stringify({ token }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log('🔍 AdminPrintPanel - Token verified:', data);
      setDoc(data);
      setWatermarkTime(new Date());
      setSecondsLeft(120);
      setIntervalActive(true);
    } catch (err) {
      console.error('❌ AdminPrintPanel - Token verification error:', err);
      setError(err?.response?.data?.message || err.message || "Failed to verify token.");
      setDoc(null); 
      setIntervalActive(false);
      setPrintStatus('error');
      setShowStatusCard(true);
    } finally {
      setLoadingDoc(false);
    }
  }

  async function handlePrint() {
    setError("");
    if (!doc?.token) { setError("Fetch document first."); return; }
    if (secondsLeft === 0 || isPrinting) return;
    const currentAuth = getAuth();
    setIsPrinting(true); 
    setPrintStatus('processing');
    setShowStatusCard(true);
    
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

      // Simulate printing process
      setTimeout(() => {
        setPrintStatus('success');
        setSecondsLeft(0);
        setIntervalActive(false);
        setIsPrinting(false);
      }, 3000);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Print failed.");
      setPrintStatus('error');
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
  const tokenStatus = secondsLeft === 0 ? "Token Expired" : "Active";
  const trustColor = trustScore >= 60 ? "#FF6B35" : "#FF8A50";
  const timerPct = (secondsLeft / 120) * 100;
  const timerColor = secondsLeft > 60 ? "#22c55e" : secondsLeft > 30 ? "#FFA05B" : "#ef4444";

  return (
    <div 
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
        fontFamily: '"Inter", sans-serif'
      }}
    >
      <SecurityOverlay />
      <PhoneDetection existingVideoRef={videoRef} />
      {showCameraModal && <CameraPermissionModal onPermissionGranted={handleCameraGranted} />}

      <NoiseSVG />
      <GridDots />
      <GlowOrb color="#FF6B35" size={600} top="-10%" left="-5%" delay={0} />
      <GlowOrb color="#FF8A50" size={400} top="40%" left="60%" delay={3} />
      <GlowOrb color="#FFA05B" size={260} top="70%" left="15%" delay={4} />

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Navigation */}
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
                <Printer className="w-5 h-5" style={{ color: "#FF6B35" }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{
                  color: "#EAEAEA",
                  fontFamily: '"Clash Display", "Inter", sans-serif',
                  fontWeight: 700
                }}>
                  Print Panel
                </h1>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Secure Document Printing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isCameraActive && (
                <div className="relative w-32 h-20 rounded-xl overflow-hidden border backdrop-blur-sm"
                  style={{
                    background: "rgba(0,0,0,0.8)",
                    borderColor: "rgba(255,255,255,0.1)"
                  }}>
                  <video ref={videoRef} autoPlay playsInline muted
                    style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
                  <div className="absolute bottom-2 left-2 flex items-center gap-2 px-2 py-1 rounded-lg backdrop-blur-sm"
                    style={{ background: "rgba(0,0,0,0.7)" }}>
                    <div className="w-2 h-2 rounded-full" style={{ 
                      background: isFaceDetected ? "#22c55e" : "#ef4444" 
                    }} />
                    <span className="text-xs font-medium" style={{ color: "#EAEAEA" }}>
                      {isFaceDetected ? "Verified" : "Scanning"}
                    </span>
                  </div>
                </div>
              )}

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
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Token Input & Document Preview */}
            <div className="space-y-6">
              {/* Token Input Card */}
              <GlassCard accent="#FF6B35">
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-3" style={{
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif'
                  }}>
                    <Key className="w-5 h-5" />
                    Enter Token
                  </h2>
                  
                  <PremiumInput
                    label="Token"
                    icon={Key}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="SPX-1234"
                    disabled={isPrinting}
                    accent="#FF6B35"
                  />

                  <div className="mt-6">
                    <PremiumButton
                      onClick={handleFetchDocument}
                      disabled={loadingDoc || isPrinting}
                      loading={loadingDoc}
                      accent="#FF6B35"
                    >
                      {loadingDoc ? "Fetching..." : "Fetch Document"}
                    </PremiumButton>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-xl backdrop-blur-sm border"
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
                </div>
              </GlassCard>

              {/* Document Preview Card */}
              <GlassCard accent="#FF8A50">
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-3" style={{
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif'
                  }}>
                    <FileText className="w-5 h-5" />
                    Document Preview
                  </h2>

                  <div className="relative rounded-xl overflow-hidden backdrop-blur-sm border min-h-[300px] flex items-center justify-center"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      borderColor: "rgba(255,255,255,0.1)"
                    }}>
                    {doc ? (
                      <>
                        {doc.fileUrl?.toLowerCase().endsWith(".pdf") ? (
                          <iframe title="Document Preview" src={`${apiBaseUrl}${doc.fileUrl}`}
                            style={{ width: "100%", height: 280, border: 0 }} />
                        ) : (
                          <img src={`${apiBaseUrl}${doc.fileUrl}`} alt="Document"
                            style={{ width: "100%", height: "auto", maxHeight: 280, objectFit: "contain" }} />
                        )}
                        {watermarkText && (
                          <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
                            <div className="px-4 py-2 rounded-lg backdrop-blur-sm border border-dashed"
                              style={{ 
                                transform: "rotate(-2deg)",
                                background: "rgba(0,0,0,0.7)",
                                borderColor: "rgba(255,255,255,0.2)",
                                color: "rgba(255,255,255,0.4)"
                              }}>
                              {watermarkText}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-center py-12">
                        <div className="p-4 rounded-xl backdrop-blur-sm border"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            borderColor: "rgba(255,255,255,0.1)"
                          }}>
                          <FileText className="w-8 h-8" style={{ color: "rgba(255,255,255,0.3)" }} />
                        </div>
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                          Fetch a token to preview document
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timer */}
                  {doc && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: timerColor }} />
                          <span className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
                            Session Timer
                          </span>
                        </div>
                        <span className="text-2xl font-bold" style={{ 
                          color: timerColor,
                          fontFamily: '"Clash Display", "Inter", sans-serif'
                        }}>
                          {secondsLeft}s
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden backdrop-blur-sm"
                        style={{ background: "rgba(255,255,255,0.1)" }}>
                        <motion.div className="h-full rounded-full" style={{ 
                          background: timerColor,
                          boxShadow: `0 0 10px ${timerColor}40`
                        }}
                          animate={{ width: `${timerPct}%` }} transition={{ duration: 0.5 }} />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>0s</span>
                        <span className="text-xs font-medium" style={{ color: timerColor }}>
                          {tokenStatus}
                        </span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>120s</span>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Right Column - Print Function & Status */}
            <div className="space-y-6">
              {/* Print Function Card */}
              <GlassCard accent="#FFA05B">
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-3" style={{
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif'
                  }}>
                    <Printer className="w-5 h-5" />
                    Print Function
                  </h2>

                  <PremiumButton
                    onClick={handlePrint}
                    disabled={!doc?.token || secondsLeft === 0 || isPrinting}
                    loading={isPrinting}
                    success={printStatus === 'success'}
                    error={printStatus === 'error'}
                    accent="#FFA05B"
                  >
                    {isPrinting ? "Printing..." : printStatus === 'success' ? "Printed Successfully" : printStatus === 'error' ? "Print Failed" : "Print Document"}
                  </PremiumButton>

                  <div className="mt-6 p-4 rounded-xl backdrop-blur-sm border"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      borderColor: "rgba(255,255,255,0.05)"
                    }}>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {printStatus === 'success' 
                        ? "Document has been sent to printer successfully"
                        : printStatus === 'error'
                        ? "Print failed. Please try again."
                        : "Token becomes invalid after use"
                      }
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Trust Score Card */}
              <GlassCard accent="#FF6B35">
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-3" style={{
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif'
                  }}>
                    <ShieldCheck className="w-5 h-5" />
                    Trust Score
                  </h2>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
                      Current Score
                    </span>
                    <span className="text-3xl font-bold" style={{ 
                      color: trustColor,
                      fontFamily: '"Clash Display", "Inter", sans-serif'
                    }}>
                      {trustScore}
                    </span>
                  </div>

                  <div className="h-3 rounded-full overflow-hidden backdrop-blur-sm mb-3"
                    style={{ background: "rgba(255,255,255,0.1)" }}>
                    <motion.div className="h-full rounded-full" style={{ 
                      background: `linear-gradient(to right, ${trustColor}, ${trustColor}dd)`,
                      boxShadow: `0 0 15px ${trustColor}30`
                    }}
                      animate={{ width: `${Math.max(0, Math.min(100, trustScore))}%` }}
                      transition={{ duration: 0.8 }} />
                  </div>

                  <div className="flex justify-between text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span>0</span>
                    <span className="font-medium" style={{ color: trustColor }}>
                      {trustScore >= 60 ? "Trusted" : "At Risk"}
                    </span>
                    <span>100</span>
                  </div>
                </div>
              </GlassCard>

              {/* Security Simulation Card */}
              <GlassCard accent="#ef4444">
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-3" style={{
                    color: "#EAEAEA",
                    fontFamily: '"Clash Display", "Inter", sans-serif'
                  }}>
                    <AlertTriangle className="w-5 h-5" />
                    Security Simulation
                  </h2>

                  <PremiumButton
                    onClick={handleAlert}
                    disabled={isPrinting || !tokenInput.trim()}
                    accent="#ef4444"
                  >
                    Simulate Suspicious Activity
                  </PremiumButton>

                  <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Reduces admin trust score and triggers email alert if configured
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Status Card */}
          <AnimatePresence>
            <StatusCard
              type={printStatus}
              message={
                printStatus === 'success' ? 'Printing Started' :
                printStatus === 'error' ? 'Invalid Token' :
                'Processing...'
              }
              isVisible={showStatusCard}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="fixed top-8 right-8 z-50 p-4 rounded-xl backdrop-blur-xl border"
            style={{
              background: "rgba(0,0,0,0.9)",
              borderColor: "rgba(255,107,53,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)"
            }}
          >
            <p className="text-sm font-medium" style={{ color: "#EAEAEA" }}>
              {popup.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating status indicator */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 border border-[#D91828]/20 bg-[#0C1519]/90 backdrop-blur-md"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
      >
        <span className="text-[10px] font-black text-[#D91828] uppercase tracking-[0.35em]">System Live</span>
        <div className="w-2.5 h-2.5 bg-[#D91828] rounded-full animate-pulse shadow-[0_0_10px_#D91828]" />
      </motion.div>
    </div>
  );
}