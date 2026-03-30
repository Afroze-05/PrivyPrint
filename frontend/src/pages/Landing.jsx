import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Printer, Lock, FileText, ChevronDown, Cpu } from "lucide-react";

const bgGif = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

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
const GridDots = ({ color = "#3BBCD9", opacity = 0.1 }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity,
    }}
  />
);

/* ── Ambient glow orb ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ scale: [1, 1.18, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ── Scan-line sweep ── */
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3BBCD9]/30 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
  />
);

/* ── Feature card ── */
const FeatureCard = ({ icon, title, text, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="group relative bg-[#0E1A21] p-8 border border-white/6 hover:border-[#3BBCD9]/35 transition-all duration-300 overflow-hidden"
    style={{ clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)" }}
  >
    {/* Top color bar */}
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D91828] to-transparent group-hover:from-[#3BBCD9] transition-all duration-500" />
    {/* Chamfer corner mark */}
    <div className="absolute top-0 right-0 w-[22px] h-[22px] border-t border-r border-[#D91828]/40 group-hover:border-[#3BBCD9]/60 transition-colors duration-300" />
    {/* Inner glow on hover */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
      style={{ background: "radial-gradient(ellipse at top left, rgba(59,188,217,0.06) 0%, transparent 70%)" }}
    />

    <div className="relative z-10">
      <div className="mb-5 w-fit p-3 bg-[#3BBCD9]/6 border border-[#3BBCD9]/15 group-hover:bg-[#3BBCD9]/12 transition-colors duration-300">
        {icon}
      </div>
      <h3
        className="text-base font-black text-white mb-3 uppercase tracking-widest"
        style={{ fontFamily: '"BlockForce", monospace' }}
      >
        {title}
      </h3>
      <p className="text-white/40 leading-relaxed text-sm font-medium">{text}</p>
    </div>

    <div className="absolute bottom-4 right-5 text-[10px] font-black text-white/8 tracking-widest">
      0{index + 1}
    </div>
  </motion.div>
);

function Landing() {
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const shutterSpring = { mass: 1.5, stiffness: 90, damping: 14, restDelta: 0.001 };

  const rawY1 = useTransform(scrollYProgress, [0, 0.33], ["-100%", "0%"]);
  const rawY2 = useTransform(scrollYProgress, [0.33, 0.66], ["-100%", "0%"]);
  const rawY3 = useTransform(scrollYProgress, [0.66, 1], ["-100%", "0%"]);

  const shutter1Y = useSpring(rawY1, shutterSpring);
  const shutter2Y = useSpring(rawY2, shutterSpring);
  const shutter3Y = useSpring(rawY3, shutterSpring);

  const features = [
    {
      icon: <Shield className="w-7 h-7 text-[#3BBCD9]" />,
      title: "Encrypted Node",
      text: "Data packets are shredded post-transmission.",
    },
    {
      icon: <Printer className="w-7 h-7 text-[#3BBCD9]" />,
      title: "Physical Link",
      text: "Release only via authenticated proximity.",
    },
    {
      icon: <Lock className="w-7 h-7 text-[#3BBCD9]" />,
      title: "Zero Cache",
      text: "No residual memory left on hardware.",
    },
  ];

  return (
    <div
      ref={targetRef}
      className="relative h-[400vh] bg-[#0C1519] overflow-visible font-sans"
      style={{ position: "relative" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ═══════════════════════════════════
            BASE LAYER — HERO
        ═══════════════════════════════════ */}
        <section className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center px-6 bg-[#0C1519]">
          <NoiseSVG />
          <GridDots />
          <ScanLine />
          <GlowOrb color="#D91828" size={480} top="-8%" left="-6%" delay={0} />
          <GlowOrb color="#3BBCD9" size={380} top="35%" left="62%" delay={2} />
          <GlowOrb color="#D9910D" size={260} top="60%" left="18%" delay={4} />

          {/* Edge rules */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3BBCD9]/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D91828]/25 to-transparent" />
          <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[#3BBCD9]/20 to-transparent" />

          {/* Minimal top-left system tag */}
          <div className="absolute top-7 left-8 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#3BBCD9]/40" />
            <span className="text-[9px] font-black tracking-[0.45em] text-white/20 uppercase">
              PrivyPrint OS v4.2
            </span>
          </div>

          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center space-y-4"
          >
            {/* Eyebrow pill */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-2.5 mb-6 px-5 py-2 border border-[#3BBCD9]/20 bg-[#3BBCD9]/4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D91828] animate-pulse shadow-[0_0_8px_#D91828]" />
              <span className="text-[9px] font-black tracking-[0.55em] text-[#3BBCD9]/80 uppercase">
                Secure Channel Active
              </span>
            </motion.div>

            {/* Wordmark */}
            <h1
              style={{
                fontFamily: '"BlockForce", ui-sans-serif, system-ui, monospace',
                lineHeight: 0.88,
              }}
              className="text-7xl md:text-9xl font-black tracking-tighter text-white uppercase select-none"
            >
              Privy
              <span className="relative inline-block">
                <span
                  className="text-[#3BBCD9]"
                  style={{ textShadow: "0 0 55px rgba(59,188,217,0.4)" }}
                >
                  Print
                </span>
                <motion.span
                  className="absolute left-0 right-0 bottom-[-4px] h-[3px] bg-gradient-to-r from-[#D91828] via-[#D9910D] to-[#3BBCD9]"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
                />
              </span>
            </h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl font-bold text-[#3BBCD9] tracking-[0.5em] uppercase opacity-70"
            >
              Privacy-Protected Printing System
            </motion.p>

            {/* Single CTA */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              onClick={() => navigate("/home")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden group mt-8 px-14 py-5 font-black uppercase tracking-[0.4em] text-white text-sm"
              style={{
                background: "linear-gradient(135deg, #D91828 0%, #a81220 100%)",
                clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
              }}
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <span className="relative z-10">Start</span>
            </motion.button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-9 flex flex-col items-center gap-2 text-white/15"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            <span className="text-[8px] tracking-[0.55em] uppercase font-black">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════
            SHUTTER 1 — FEATURES
        ═══════════════════════════════════ */}
        <motion.section
          style={{ y: shutter1Y }}
          className="absolute inset-0 z-10 flex items-center px-10 md:px-32 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[#0E1A21]" />
          <NoiseSVG />
          <GridDots color="#3BBCD9" opacity={0.07} />
          <GlowOrb color="#3BBCD9" size={550} top="-20%" left="-8%" delay={0} />
          <GlowOrb color="#D91828" size={300} top="55%" left="70%" delay={3} />

          {/* Left accent stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#3BBCD9] via-[#D91828]/60 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#3BBCD9]/40 via-[#D91828]/20 to-transparent" />

          <div className="relative z-10 w-full max-w-7xl mx-auto">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#3BBCD9]" />
              <span className="text-[9px] tracking-[0.55em] font-black text-[#3BBCD9]/70 uppercase">
                Core Architecture
              </span>
            </div>

            <h2
              className="text-5xl md:text-7xl font-black text-white uppercase leading-[0.9] mb-16"
              style={{ fontFamily: '"BlockForce", monospace' }}
            >
              Hardened{" "}
              <br />
              <span
                className="text-[#3BBCD9]"
                style={{ textShadow: "0 0 40px rgba(59,188,217,0.35)" }}
              >
                Privacy.
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <FeatureCard key={i} {...f} index={i} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════
            SHUTTER 2 — ENCRYPTION
        ═══════════════════════════════════ */}
        <motion.section
          style={{ y: shutter2Y }}
          className="absolute inset-0 z-20 flex flex-col justify-center items-center px-10"
        >
          <div className="absolute inset-0 bg-[#0F1A0F]" />
          <NoiseSVG />
          <GridDots color="#D9910D" opacity={0.07} />
          <GlowOrb color="#D9910D" size={650} top="-15%" left="25%" delay={0} />
          <GlowOrb color="#D91828" size={350} top="45%" left="-5%" delay={2} />

          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#D9910D] via-[#D91828]/60 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#D9910D]/40 to-transparent" />

          <div className="relative z-10 text-center space-y-8">
            {/* Label */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-10 bg-[#D9910D]" />
              <span className="text-[9px] tracking-[0.55em] font-black text-[#D9910D]/70 uppercase">
                Encryption Standard
              </span>
              <div className="h-px w-10 bg-[#D9910D]" />
            </div>

            <h2
              className="text-6xl md:text-8xl font-black uppercase leading-[0.88]"
              style={{ fontFamily: '"BlockForce", monospace' }}
            >
              <span
                className="text-[#D9910D]"
                style={{ textShadow: "0 0 55px rgba(217,145,13,0.45)" }}
              >
                Locked
              </span>{" "}
              <span className="text-[#D91828]">Pad</span>
            </h2>

            {/* AES stat card */}
            <div className="flex justify-center pt-4">
              <div
                className="relative flex flex-col items-center gap-3 px-16 py-10 border border-[#D9910D]/20 bg-white/2 overflow-hidden"
                style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D9910D] to-[#D91828]" />
                <div className="absolute top-0 right-0 w-[20px] h-[20px] border-t border-r border-[#D9910D]/40" />
                <p
                  className="text-[#3BBCD9] text-6xl font-black tracking-tight"
                  style={{ fontFamily: '"BlockForce", monospace', textShadow: "0 0 30px rgba(59,188,217,0.4)" }}
                >
                  AES
                </p>
                <p className="text-white/25 uppercase text-[10px] font-black tracking-[0.5em]">
                  256‑Bit Standard
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════
            SHUTTER 3 — FINAL CTA
        ═══════════════════════════════════ */}
        <motion.section
          style={{ y: shutter3Y }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-10"
        >
          <div className="absolute inset-0 bg-[#0C1519]" />
          <NoiseSVG />
          <GridDots opacity={0.09} />
          <GlowOrb color="#D91828" size={560} top="5%" left="8%" delay={0} />
          <GlowOrb color="#3BBCD9" size={440} top="30%" left="55%" delay={2} />

          {/* Triple-color top bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#D91828] via-[#D9910D] to-[#3BBCD9]" />
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#D91828] via-[#D9910D]/50 to-transparent" />

          <div className="relative z-10 p-12 flex flex-col items-center text-center">
            <FileText
              className="w-16 h-16 text-[#3BBCD9] mb-6"
              style={{ filter: "drop-shadow(0 0 20px rgba(59,188,217,0.5))" }}
            />

            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#D91828]" />
              <span className="text-[9px] tracking-[0.55em] font-black text-[#D91828]/70 uppercase">
                Ready to Deploy
              </span>
              <div className="h-px w-10 bg-[#D91828]" />
            </div>

            <h2
              className="text-5xl md:text-8xl font-black text-center text-white leading-tight mb-12 uppercase"
              style={{ fontFamily: '"BlockForce", monospace' }}
            >
              Initialize <br />{" "}
              <span
                className="text-[#D91828]"
                style={{ textShadow: "0 0 55px rgba(217,24,40,0.5)" }}
              >
                Secure Print
              </span>
            </h2>

            {/* Single button — same as original */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <motion.button
                onClick={() => navigate("/home")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden group px-14 py-5 font-black uppercase tracking-widest text-white text-sm"
                style={{
                  background: "linear-gradient(135deg, #D91828 0%, #a81220 100%)",
                  clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)",
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                <span className="relative z-10">START</span>
              </motion.button>
            </div>
          </div>
        </motion.section>
      </div>

      {/* ── Floating status indicator ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed top-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 border border-[#3BBCD9]/20 bg-[#0C1519]/90 backdrop-blur-md"
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

export default Landing;