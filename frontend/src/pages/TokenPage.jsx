import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Cpu,
  Download,
  ArrowLeft,
  AlertTriangle,
  Timer,
  Copy,
  Lock,
  Check,
  Mic,
} from "lucide-react";

/* ── Noise grain overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none z-0"
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

/* ── Dot-grid background ── */
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

/* ── Ambient glow orb ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.22, 0.12] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ── Scan-line sweep ── */
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B35]/25 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
  />
);

/* ── QR-code mosaic ── */
const QRMosaic = ({ seed = 42 }) => {
  const cells = Array.from({ length: 49 }, (_, i) => {
    const v = (i * 7 + seed * 3) % 17;
    return v > 7;
  });
  return (
    <div
      className="w-24 h-24 p-2 border border-white/15"
      style={{
        background: "rgba(255,255,255,0.03)",
        clipPath:
          "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
      }}
    >
      <div className="w-full h-full grid grid-cols-7 gap-[1.5px]">
        {cells.map((filled, i) => (
          <div
            key={i}
            className="rounded-[1px]"
            style={{ background: filled ? "#FF6B35" : "transparent" }}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Countdown timer ── */
const Countdown = ({ navigate, onExpired }) => {
  const [secs, setSecs] = useState(() => {
    // Get stored timer start time or initialize new
    const storedStartTime = localStorage.getItem('tokenTimerStart');
    const storedDuration = localStorage.getItem('tokenDuration');
    
    if (storedStartTime && storedDuration) {
      const elapsed = Math.floor((Date.now() - parseInt(storedStartTime)) / 1000);
      const remaining = parseInt(storedDuration) - elapsed;
      return Math.max(0, remaining);
    }
    
    // Store initial timer state
    localStorage.setItem('tokenTimerStart', Date.now().toString());
    localStorage.setItem('tokenDuration', '120');
    return 120;
  });

  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSecs((s) => {
        const newSecs = Math.max(0, s - 1);
        
        // Update localStorage
        const elapsed = 120 - newSecs;
        localStorage.setItem('tokenTimerStart', (Date.now() - (elapsed * 1000)).toString());
        localStorage.setItem('tokenDuration', '120');
        
        if (newSecs === 0) {
          setExpired(true);
          // Clear customer token when expired
          localStorage.removeItem('customerToken');
          localStorage.removeItem('tokenTimerStart');
          localStorage.removeItem('tokenDuration');
          onExpired();
        }
        
        return newSecs;
      });
    }, 1000);
    
    return () => clearInterval(id);
  }, [onExpired]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const pct = secs > 0 ? (secs / 120) * 100 : 0;
  const accent = secs > 20 ? "#FF6B35" : "#ef4444";

  if (expired) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 border border-red-500/30 bg-red-500/10 rounded-lg">
        <AlertTriangle className="w-8 h-8 text-red-400" />
        <div className="text-center">
          <span className="text-sm font-black text-red-400 uppercase tracking-widest">
            Token Expired
          </span>
          <p className="text-xs text-gray-400 mt-2">
            Please upload the document again.
          </p>
        </div>
        <button
          onClick={() => navigate("/upload")}
          className="px-4 py-2 bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-red-600 transition-colors"
        >
          Upload Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-3.5 h-3.5" style={{ color: accent }} />
          <span className="text-[9px] font-black tracking-[0.45em] text-white/30 uppercase">
            Token Expires In
          </span>
        </div>
        <span
          className="text-sm font-black tracking-widest"
          style={{ fontFamily: "monospace", color: accent }}
        >
          {mm}:{ss}
        </span>
      </div>
      <div className="h-[4px] bg-white/6 overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            background: accent,
            width: `${pct}%`,
            boxShadow: `0 0 8px ${accent}`,
          }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default function TokenPage() {
  const navigate = useNavigate();
  const customerToken = JSON.parse(localStorage.getItem("customerToken"));
  const token = customerToken?.token || "";
  const type = localStorage.getItem("printType") || "B/W";
  const [copied, setCopied] = useState(false);
  const [expired, setExpired] = useState(false);

  console.log("Token received:", customerToken);

  // Check if token exists, if not redirect to upload
  useEffect(() => {
    if (!customerToken || !customerToken.token) {
      console.log("No token found, redirecting to upload...");
      navigate("/upload");
    }
  }, [customerToken, navigate]);

  // Check if token is already expired on mount
  useEffect(() => {
    const storedStartTime = localStorage.getItem('tokenTimerStart');
    const storedDuration = localStorage.getItem('tokenDuration');
    
    if (storedStartTime && storedDuration) {
      const elapsed = Math.floor((Date.now() - parseInt(storedStartTime)) / 1000);
      const remaining = parseInt(storedDuration) - elapsed;
      if (remaining <= 0) {
        setExpired(true);
        localStorage.removeItem('customerToken');
        localStorage.removeItem('tokenTimerStart');
        localStorage.removeItem('tokenDuration');
      }
    }
  }, []);

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log(err);
      const textArea = document.createElement("textarea");
      textArea.value = token;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden font-sans"
      style={{
        background:
          "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
      }}
    >
      <NoiseSVG />
      <GridDots />
      <ScanLine />
      <GlowOrb color="#FF6B35" size={460} top="-8%" left="-6%" />
      <GlowOrb color="#FF8A50" size={340} top="50%" left="60%" delay={2} />

      {/* System tag */}
      <div className="absolute top-7 left-8 flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 opacity-40 text-[#FF6B35]" />
        <span className="text-[9px] font-black tracking-[0.45em] text-white/20 uppercase">
          PrivyPrint OS v4.2
        </span>
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="absolute top-7 right-8 flex items-center gap-2 text-white/20 hover:text-[#FF6B35] transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[9px] font-black tracking-[0.45em] uppercase">
          Done
        </span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Success Indicator */}
        <div className="flex flex-col items-center mb-8">
          <div className={`w-16 h-16 flex items-center justify-center border ${expired ? 'border-red-400/30 bg-red-400/10' : 'border-green-400/30 bg-green-400/10'} mb-5`}>
            {expired ? (
              <AlertTriangle className="w-7 h-7 text-red-400" />
            ) : (
              <CheckCircle className="w-7 h-7 text-green-400" />
            )}
          </div>
          <div className={`px-5 py-2 border ${expired ? 'border-red-400/20 bg-red-400/5' : 'border-green-400/20 bg-green-400/5'}`}>
            <span className={`text-[9px] font-black tracking-[0.55em] uppercase ${expired ? 'text-red-400/80' : 'text-green-400/80'}`}>
              {expired ? "Session Expired" : "File Uploaded Securely"}
            </span>
          </div>
        </div>

        <h1 className="text-5xl font-black tracking-tighter text-white uppercase text-center mb-2">
          Secure <span className="text-[#FF6B35]">Session</span>
        </h1>

        <div className="relative backdrop-blur-xl border rounded-2xl p-6 bg-white/5 border-white/10 shadow-2xl">
          <div className="relative z-10 flex flex-col gap-6">
            {/* Token Display Area - Hidden when expired */}
            {!expired && (
              <div className="relative p-5 border border-[#FF6B35]/15 bg-[#050505] rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#FF6B35]/60" />
                    <span className="text-[9px] font-black tracking-[0.5em] text-[#FF6B35]/50 uppercase">
                      Secure Access Token
                    </span>
                  </div>
                  <button onClick={handleCopyToken} className="text-[#FF6B35]">
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="text-5xl font-black tracking-[0.2em] text-white text-center py-3">
                  {token}
                </div>

                <div className="flex justify-center gap-3 mt-3">
                  <div className="px-3 py-1 border border-white/10 bg-white/4 text-[9px] font-black text-white/40 uppercase">
                    Mode: {type}
                  </div>
                </div>
              </div>
            )}

            {/* QR + Kiosk Label - Hidden when expired */}
            {!expired && (
              <div className="flex flex-col items-center gap-2">
                <QRMosaic seed={token.charCodeAt(0)} token={token} />
                <span className="text-[9px] font-black tracking-[0.45em] text-white/20 uppercase">
                  Scan at Kiosk
                </span>
              </div>
            )}

            <Countdown navigate={navigate} onExpired={() => setExpired(true)} />

            {/* Voice Print Shortcut - Hidden when expired */}
            {!expired && (
              <motion.button
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(255, 107, 53, 0.1)",
                }}
                onClick={() => navigate("/voice-print")}
                className="w-full p-4 rounded-xl border-2 border-dashed border-[#FF6B35]/30 bg-[#FF6B35]/5 flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-2 text-[#FF6B35]">
                  <Mic className="w-4 h-4 animate-pulse" />
                  <span className="font-bold text-xs uppercase tracking-widest">
                    Try Voice Print
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 italic">
                  Say: "Print token {token}"
                </p>
              </motion.button>
            )}

            {/* Final Actions - Hidden when expired */}
            {!expired && (
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => window.print()}
                  className="w-full py-4 font-black uppercase tracking-[0.4em] text-white text-sm bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] flex items-center justify-center gap-2 rounded-lg"
                >
                  <Download className="w-4 h-4" /> Download Slip
                </motion.button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full py-3.5 border border-white/10 text-white/30 hover:text-[#FF6B35] transition-all text-[10px] font-black uppercase tracking-[0.35em]"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
