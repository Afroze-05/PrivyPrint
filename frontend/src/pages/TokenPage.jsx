import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Key, Cpu, Download, ArrowLeft, AlertTriangle, Timer } from 'lucide-react';
import { getCustomerToken } from '../services/customerTokenStorage';

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
      backgroundSize: '36px 36px',
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
    transition={{ duration: 6, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

/* ── Scan-line sweep ── */
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3BBCD9]/25 to-transparent pointer-events-none z-10"
    animate={{ top: ['0%', '100%'] }}
    transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
  />
);

/* ── QR-code mosaic (static decorative) ── */
const QRMosaic = ({ seed = 42 }) => {
  const cells = Array.from({ length: 49 }, (_, i) => {
    // deterministic pattern based on index
    const v = (i * 7 + seed * 3) % 17;
    return v > 7;
  });
  return (
    <div
      className="w-24 h-24 p-2 border border-white/15 bg-[#0E1A21]"
      style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
    >
      <div className="w-full h-full grid grid-cols-7 gap-[1.5px]">
        {cells.map((filled, i) => (
          <div
            key={i}
            className="rounded-[1px]"
            style={{ background: filled ? '#3BBCD9' : 'transparent' }}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Countdown timer ── */
const Countdown = () => {
  const [secs, setSecs] = useState(600); // 10 min
  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');
  const pct = (secs / 600) * 100;
  const accent = secs > 180 ? '#3BBCD9' : '#D91828';
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
          style={{ fontFamily: '"BlockForce", monospace', color: accent }}
        >
          {mm}:{ss}
        </span>
      </div>
      <div
        className="h-[4px] bg-white/6 overflow-hidden"
        style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 0 100%)' }}
      >
        <motion.div
          className="h-full"
          style={{ background: accent, width: `${pct}%`, boxShadow: `0 0 8px ${accent}` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default function TokenPage() {
  const navigate = useNavigate();
  const customerToken = getCustomerToken();
  const token = customerToken?.token || 'SPX-0000';
  const type = localStorage.getItem('printType') || 'B/W';

  // Debug logs
  console.log('🔍 TokenPage - Retrieved customer token:', customerToken);
  console.log('🔍 TokenPage - Displaying token:', token);

  return (
    <div className="relative min-h-screen bg-[#0C1519] flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
      <NoiseSVG />
      <GridDots />
      <ScanLine />
      <GlowOrb color="#3BBCD9" size={460} top="-8%" left="-6%" delay={0} />
      <GlowOrb color="#D91828" size={340} top="50%" left="60%" delay={2} />
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
        onClick={() => navigate('/')}
        className="absolute top-7 right-8 flex items-center gap-2 text-white/20 hover:text-[#3BBCD9] transition-colors duration-300 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-[9px] font-black tracking-[0.45em] uppercase">Done</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* ── Success badge ── */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 14 }}
            className="relative mb-5"
          >
            {/* Ping ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#3BBCD9]/30"
              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <div
              className="w-16 h-16 flex items-center justify-center border border-[#3BBCD9]/30 bg-[#3BBCD9]/10"
              style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
            >
              <CheckCircle className="w-7 h-7 text-[#3BBCD9]" style={{ filter: 'drop-shadow(0 0 10px rgba(59,188,217,0.6))' }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2.5 px-5 py-2 border border-[#3BBCD9]/20 bg-[#3BBCD9]/4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#3BBCD9] shadow-[0_0_8px_#3BBCD9]" />
            <span className="text-[9px] font-black tracking-[0.55em] text-[#3BBCD9]/80 uppercase">
              Document Uploaded
            </span>
          </motion.div>
        </div>

        {/* ── Title ── */}
        <h1
          style={{ fontFamily: '"BlockForce", ui-sans-serif, system-ui, monospace', lineHeight: 0.88 }}
          className="text-5xl font-black tracking-tighter text-white uppercase select-none mb-2 text-center"
        >
          Secure{' '}
          <span className="text-[#3BBCD9]" style={{ textShadow: '0 0 40px rgba(59,188,217,0.4)' }}>
            Session
          </span>
        </h1>
        <p className="text-center text-[10px] font-bold text-white/25 tracking-[0.5em] uppercase mb-6">
          Your print session is ready
        </p>
        <div className="w-full h-[2px] bg-gradient-to-r from-[#3BBCD9] via-[#D9910D] to-transparent mb-8" />

        {/* ── Main card ── */}
        <div
          className="relative bg-[#0E1A21] border border-white/6 p-6 overflow-hidden"
          style={{ clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3BBCD9] via-[#D9910D] to-transparent" />
          <div className="absolute top-0 right-0 w-[24px] h-[24px] border-t border-r border-[#3BBCD9]/30" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at top left, rgba(59,188,217,0.04) 0%, transparent 60%)' }} />

          <div className="relative z-10 flex flex-col gap-6">

            {/* ── Token block ── */}
            <div
              className="relative p-5 border border-[#3BBCD9]/15 bg-[#0C1519] overflow-hidden"
              style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#3BBCD9]/60 to-transparent" />
              {/* Ambient glow */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(59,188,217,0.06) 0%, transparent 70%)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              <div className="flex items-center gap-2 mb-3">
                <Key className="w-3.5 h-3.5 text-[#3BBCD9]/60" />
                <span className="text-[9px] font-black tracking-[0.5em] text-[#3BBCD9]/50 uppercase">
                  Secure Access Token
                </span>
              </div>

              <div
                className="text-5xl font-black tracking-[0.2em] text-white text-center py-3"
                style={{
                  fontFamily: '"BlockForce", monospace',
                  textShadow: '0 0 40px rgba(59,188,217,0.35)',
                }}
              >
                {token}
              </div>

              <div className="flex justify-center gap-3 mt-3">
                {[`Mode: ${type}`, '⏳ Waiting'].map((label) => (
                  <div
                    key={label}
                    className="px-3 py-1 border border-white/10 bg-white/4 text-[9px] font-black tracking-[0.3em] text-white/40 uppercase"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── QR + scan label ── */}
            <div className="flex flex-col items-center gap-2">
              <QRMosaic seed={token.charCodeAt(4) || 42} />
              <span className="text-[9px] font-black tracking-[0.45em] text-white/20 uppercase">
                Scan at Kiosk
              </span>
            </div>

            {/* ── Countdown ── */}
            <Countdown />

            {/* ── Warning ── */}
            <div
              className="flex items-start gap-3 px-4 py-3 border border-[#D91828]/20 bg-[#D91828]/5"
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
            >
              <AlertTriangle className="w-4 h-4 text-[#D91828] flex-shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-white/35 leading-relaxed">
                Token expires in{' '}
                <span className="font-black text-[#D91828]">10 minutes</span>.{' '}
                Do not share this code.
              </p>
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.print()}
                className="relative overflow-hidden group w-full py-4 font-black uppercase tracking-[0.4em] text-white text-sm flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #D91828 0%, #a81220 100%)',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <Download className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Download Slip</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/')}
                className="w-full py-3.5 border border-white/8 text-white/30 hover:text-[#3BBCD9] hover:border-[#3BBCD9]/30 transition-all duration-300 text-[10px] font-black uppercase tracking-[0.35em]"
              >
                Done
              </motion.button>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Floating status indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 border border-[#3BBCD9]/20 bg-[#0C1519]/90 backdrop-blur-md"
        style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
      >
        <span className="text-[10px] font-black text-[#3BBCD9] uppercase tracking-[0.35em]">
          System Live
        </span>
        <div className="w-2.5 h-2.5 bg-[#D91828] rounded-full animate-pulse shadow-[0_0_10px_#D91828]" />
      </motion.div>
    </div>
  );
}