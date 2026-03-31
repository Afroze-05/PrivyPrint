import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Cpu, ArrowLeft, ChevronRight, Mail, AlertTriangle } from "lucide-react";

/* ── Noise grain overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none z-0"
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
      backgroundImage: `radial-gradient(circle, #3BBCD9 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity: 0.08,
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
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3BBCD9]/25 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
  />
);

/* ── OTP digit boxes ── */
const OtpBoxes = ({ value, onChange }) => {
  const inputRefs = useRef([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  function handleKey(i, e) {
    if (e.key === "Backspace") {
      const next = value.split("");
      next[i] = "";
      onChange(next.join(""));
      if (i > 0) inputRefs.current[i - 1]?.focus();
    }
  }

  function handleChange(i, e) {
    const raw = e.target.value.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[i] = raw;
    onChange(next.join(""));
    if (raw && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  }

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 + i * 0.06 }}
          className="relative"
        >
          <input
            ref={el => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e)}
            onKeyDown={e => handleKey(i, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-xl font-black text-white bg-[#0C1519] border border-white/8
              focus:outline-none focus:border-[#3BBCD9]/60 transition-all duration-200 tracking-widest
              caret-[#3BBCD9]"
            style={{
              fontFamily: '"BlockForce", monospace',
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
            }}
          />
          {/* Bottom glow on focus */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: d ? "rgba(59,188,217,0.6)" : "transparent", transition: "background 0.2s" }}
          />
          {/* Filled top bar */}
          {d && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute top-0 left-0 right-0 h-[2px] bg-[#3BBCD9]"
              style={{ originX: 0 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        email,
        otp: String(otp).trim(),
      });
      navigate("/login-selection");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Code");
    } finally {
      setLoading(false);
    }
  };

  const isComplete = otp.replace(/\D/g, "").length === 6;

  return (
    <div className="relative min-h-screen bg-[#0C1519] flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
      <NoiseSVG />
      <GridDots />
      <ScanLine />
      <GlowOrb color="#3BBCD9" size={460} top="-8%" left="-6%" delay={0} />
      <GlowOrb color="#D91828" size={340} top="48%" left="60%" delay={2} />
      <GlowOrb color="#D9910D" size={220} top="68%" left="10%" delay={4} />

      {/* Edge rules */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3BBCD9]/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D91828]/20 to-transparent" />
      <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[#3BBCD9]/20 to-transparent" />
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D91828]/15 to-transparent" />

      {/* System tag */}
      <div className="absolute top-7 left-8 flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-[#3BBCD9]/40" />
        <span className="text-[9px] font-black tracking-[0.45em] text-white/20 uppercase">
          PrivyPrint OS v4.2
        </span>
      </div>

      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => navigate(-1)}
        className="absolute top-7 right-8 flex items-center gap-2 text-white/20 hover:text-[#3BBCD9] transition-colors duration-300 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-[9px] font-black tracking-[0.45em] uppercase">Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Icon + eyebrow */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
            className="relative mb-5"
          >
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#3BBCD9]/25"
              animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
            <div
              className="w-16 h-16 flex items-center justify-center border border-[#3BBCD9]/25 bg-[#3BBCD9]/8"
              style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)" }}
            >
              <ShieldCheck
                className="w-7 h-7 text-[#3BBCD9]"
                style={{ filter: "drop-shadow(0 0 10px rgba(59,188,217,0.6))" }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2.5 px-5 py-2 border border-[#3BBCD9]/20 bg-[#3BBCD9]/4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D91828] animate-pulse shadow-[0_0_8px_#D91828]" />
            <span className="text-[9px] font-black tracking-[0.55em] text-[#3BBCD9]/80 uppercase">
              Identity Verification
            </span>
          </motion.div>
        </div>

        {/* Title */}
        <h1
          style={{ fontFamily: '"BlockForce", ui-sans-serif, system-ui, monospace', lineHeight: 0.88 }}
          className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase select-none mb-2 text-center"
        >
          Secure{" "}
          <span className="text-[#3BBCD9]" style={{ textShadow: "0 0 40px rgba(59,188,217,0.4)" }}>
            Verify
          </span>
        </h1>
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#3BBCD9] via-50% to-transparent mb-8 mt-5" />

        {/* Form panel */}
        <div
          className="relative bg-[#0E1A21] border border-white/6 p-8 overflow-hidden"
          style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3BBCD9] via-[#D9910D] to-transparent" />
          <div className="absolute top-0 right-0 w-[24px] h-[24px] border-t border-r border-[#3BBCD9]/30" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top left, rgba(59,188,217,0.04) 0%, transparent 60%)" }} />

          <form onSubmit={handleVerify}>
            <div className="relative z-10 flex flex-col gap-7">

              {/* Email hint */}
              <div className="flex items-center gap-3 px-4 py-3 border border-white/6 bg-white/2">
                <Mail className="w-3.5 h-3.5 text-[#3BBCD9]/50 flex-shrink-0" />
                <div>
                  <p className="text-[9px] font-black tracking-[0.4em] text-white/25 uppercase mb-0.5">
                    Code sent to
                  </p>
                  <p className="text-xs font-black text-white/60 tracking-wider">{email}</p>
                </div>
              </div>

              {/* OTP label */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-6 bg-[#3BBCD9]/50" />
                  <span className="text-[9px] font-black tracking-[0.5em] text-white/30 uppercase">
                    Enter 6-Digit OTP
                  </span>
                </div>

                {/* OTP digit boxes */}
                <OtpBoxes value={otp} onChange={setOtp} />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 px-4 py-3 border border-[#D91828]/30 bg-[#D91828]/8"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-[#D91828] flex-shrink-0" />
                    <span className="text-[#D91828] text-xs font-bold">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || !isComplete}
                whileHover={{ scale: loading || !isComplete ? 1 : 1.02 }}
                whileTap={{ scale: loading || !isComplete ? 1 : 0.97 }}
                className="relative overflow-hidden group w-full py-4 font-black uppercase tracking-[0.4em] text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, #D91828 0%, #a81220 100%)",
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify &amp; Continue
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </span>
              </motion.button>

            </div>
          </form>
        </div>
      </motion.div>

      {/* Floating status indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 border border-[#3BBCD9]/20 bg-[#0C1519]/90 backdrop-blur-md"
        style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
      >
        <span className="text-[10px] font-black text-[#3BBCD9] uppercase tracking-[0.35em]">
          System Live
        </span>
        <div className="w-2.5 h-2.5 bg-[#D91828] rounded-full animate-pulse shadow-[0_0_10px_#D91828]" />
      </motion.div>
    </div>
  );
}