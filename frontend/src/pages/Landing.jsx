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
const GridDots = ({ color = "var(--accent)", opacity = 0.1 }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity,
    }}
  />
);

/* ── Ambient glow orb with enhanced animation ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{
      scale: [1, 1.2, 1.1, 1.3, 1],
      opacity: [0.15, 0.25, 0.2, 0.3, 0.15],
      x: [0, 20, -10, 15, 0],
      y: [0, -15, 10, -5, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
      times: [0, 0.25, 0.5, 0.75, 1],
    }}
  />
);

/* ── Scan-line sweep ── */
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
  />
);

/* ── Enhanced Feature card with 3D transformations ── */
const FeatureCard = ({ icon, title, text, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotateX: 15, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
    transition={{ 
      delay: index * 0.15, 
      duration: 0.8,
      type: "spring",
      stiffness: 100,
      damping: 15
    }}
    whileHover={{ 
      y: -10,
      scale: 1.02,
      rotateX: -5,
      rotateY: 5,
      transition: { duration: 0.3, type: "spring", stiffness: 400 }
    }}
    className="group relative bg-orange-50 p-8 border border-orange-200 hover:border-orange-400 transition-all duration-500 overflow-hidden"
    style={{ 
      clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
      transformStyle: "preserve-3d",
      perspective: "1000px"
    }}
  >
    {/* Enhanced Top color bar with animation */}
    <motion.div 
      className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)] to-transparent group-hover:from-[var(--accent-hover)] transition-all duration-500"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
    />
    {/* Chamfer corner mark with animation */}
    <motion.div 
      className="absolute top-0 right-0 w-[22px] h-[22px] border-t border-r border-orange-300 group-hover:border-orange-500 transition-colors duration-300"
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15 + 0.4, duration: 0.3 }}
    />
    {/* Enhanced Inner glow on hover */}
    <motion.div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
      style={{ background: "radial-gradient(ellipse at center, var(--accent-light) 0%, transparent 70%)" }}
      animate={{ opacity: [0, 0, 0.3, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    {/* Floating particles on hover */}
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-60"
          initial={{ 
            x: Math.random() * 100, 
            y: Math.random() * 100,
            scale: 0
          }}
          whileHover={{
            x: [Math.random() * 100, Math.random() * 100],
            y: [Math.random() * 100, Math.random() * 100],
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 1
          }}
        />
      ))}
    </div>

    <div className="relative z-10">
      {/* Icon with enhanced animation */}
      <motion.div 
        className="mb-5 w-fit p-3 bg-orange-100 border border-orange-300 group-hover:bg-orange-200 transition-all duration-300 rounded-full"
        whileHover={{ 
          rotate: 360,
          scale: 1.1,
          transition: { duration: 0.6, ease: "easeInOut" }
        }}
      >
        {icon}
      </motion.div>
      {/* Title with stagger animation */}
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.15 + 0.2, duration: 0.5 }}
        className="text-base font-black text-black mb-3 uppercase tracking-widest"
        style={{ fontFamily: '"BlockForce", monospace' }}
      >
        {title}
      </motion.h3>
      {/* Description with fade-in */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
        className="text-orange-500 leading-relaxed text-sm font-medium"
      >
        {text}
      </motion.p>
    </div>

    {/* Number with animation */}
    <motion.div 
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.15 + 0.5, duration: 0.3 }}
      className="absolute bottom-4 right-5 text-[10px] font-black text-[var(--text-muted)] tracking-widest"
    >
      0{index + 1}
    </motion.div>
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
      icon: <Shield className="w-7 h-7 text-[var(--accent)]" />,
      title: "Encrypted Node",
      text: "Data packets are shredded post-transmission.",
    },
    {
      icon: <Printer className="w-7 h-7 text-[var(--accent)]" />,
      title: "Physical Link",
      text: "Release only via authenticated proximity.",
    },
    {
      icon: <Lock className="w-7 h-7 text-[var(--accent)]" />,
      title: "Zero Cache",
      text: "No residual memory left on hardware.",
    },
  ];

  return (
    <div
      ref={targetRef}
      className="relative h-[400vh] bg-[var(--bg-primary)] overflow-visible font-sans"
      style={{ position: "relative" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ═══════════════════════════════════
            BASE LAYER — HERO
        ═══════════════════════════════════ */}
        <section className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center px-6 bg-[var(--bg-primary)]">
          <NoiseSVG />
          <GridDots />
          <ScanLine />
          <GlowOrb color="var(--accent)" size={480} top="-8%" left="-6%" delay={0} />
          <GlowOrb color="var(--accent-hover)" size={380} top="35%" left="62%" delay={2} />
          <GlowOrb color="var(--warning)" size={260} top="60%" left="18%" delay={4} />

          {/* Edge rules */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--warning)]/25 to-transparent" />
          <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--accent)]/20 to-transparent" />

          {/* Minimal top-left system tag */}
          <div className="absolute top-7 left-8 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[var(--accent)]/40" />
            <span className="text-[9px] font-black tracking-[0.45em] text-[var(--text-muted)] uppercase">
              PrivyPrint OS v4.2
            </span>
          </div>

          {/* Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center space-y-6"
          >
            {/* Eyebrow pill */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px var(--accent-light)",
                transition: { duration: 0.2 }
              }}
              className="flex items-center gap-2.5 mb-8 px-6 py-3 border border-[var(--accent)]/30 bg-[var(--accent)]/8 backdrop-blur-sm rounded-full"
            >
              <motion.span 
                className="w-2 h-2 rounded-full bg-[var(--warning)] shadow-[0_0_12px_var(--warning)]"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.span 
                className="text-[10px] font-black tracking-[0.55em] text-[var(--accent)]/90 uppercase"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Secure Channel Active
              </motion.span>
            </motion.div>

            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
              animate={mounted ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: '"BlockForce", ui-sans-serif, system-ui, monospace',
                lineHeight: 0.88,
                transformStyle: "preserve-3d",
              }}
              className="text-7xl md:text-9xl font-black tracking-tighter text-[var(--text-primary)] uppercase select-none"
            >
              <motion.span
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Privy
              </motion.span>
              <span className="relative inline-block">
                <motion.span
                  className="text-[var(--accent)]"
                  style={{ textShadow: "0 0 60px var(--accent-light)" }}
                  animate={{ 
                    textShadow: [
                      "0 0 60px var(--accent-light)",
                      "0 0 80px var(--accent-light)",
                      "0 0 60px var(--accent-light)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Print
                </motion.span>
                <motion.span
                  className="absolute left-0 right-0 bottom-[-4px] h-[3px] bg-gradient-to-r from-[var(--warning)] via-[var(--accent-hover)] to-[var(--accent)]"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                  whileInView={{ scaleX: [0, 1] }}
                />
                {/* Floating particles around "Print" */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[var(--accent)] rounded-full"
                    initial={{ 
                      x: 0,
                      y: 0,
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 100],
                      y: [0, (Math.random() - 0.5) * 100],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                    style={{
                      top: `${50 + (Math.random() - 0.5) * 100}%`,
                      left: `${50 + (Math.random() - 0.5) * 100}%`,
                    }}
                  />
                ))}
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl font-bold text-[var(--accent)] tracking-[0.5em] uppercase"
              style={{ textShadow: "0 0 20px var(--accent-light)" }}
            >
              {["Privacy-Protected", "Printing", "System"].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                  className="inline-block mr-2"
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            {/* CTA button */}
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6, type: "spring", stiffness: 100 }}
              onClick={() => navigate("/home")}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px var(--accent-light)",
                transition: { duration: 0.2, type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden group mt-8 px-16 py-6 font-black uppercase tracking-[0.4em] text-white text-sm"
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)",
                clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              {/* Button content */}
              <motion.span 
                className="relative z-10 flex items-center gap-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Start
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.div>
              </motion.span>
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at center, var(--accent-light) 0%, transparent 70%)",
                }}
              />
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
            SHUTTER 1 — FEATURES (Updated Design)
        ═══════════════════════════════════ */}
        <motion.section
          style={{ y: shutter1Y }}
          className="absolute inset-0 z-10 flex items-center px-10 md:px-32 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[#7B1509]" />
          <NoiseSVG />
          <GridDots color="var(--accent)" opacity={0.08} />
          <GlowOrb color="var(--accent)" size={550} top="-20%" left="-8%" delay={0} />
          <GlowOrb color="var(--warning)" size={300} top="55%" left="70%" delay={3} />

          {/* Left accent stripe */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--accent)] via-[var(--warning)]/60 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[var(--accent)]/40 via-[var(--warning)]/20 to-transparent" />

          <div className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Left side - Heading */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Section label */}
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="h-px w-10 bg-[var(--accent)]"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.3 }}
                />
                <motion.span 
                  className="text-[10px] tracking-[0.55em] font-black text-[var(--accent)]/70 uppercase"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Core Architecture
                </motion.span>
              </motion.div>

              {/* Main heading */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-6xl font-black text-black uppercase leading-[0.9]"
                style={{ fontFamily: '"BlockForce", monospace' }}
              >
                Hardened{" "}
                <br />
                <motion.span
                  className="text-[var(--accent)]"
                  style={{ textShadow: "0 0 40px var(--accent-light)" }}
                  animate={{ 
                    textShadow: [
                      "0 0 40px var(--accent-light)",
                      "0 0 60px var(--accent-light)",
                      "0 0 40px var(--accent-light)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Privacy.
                </motion.span>
              </motion.h2>

              {/* Description text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-black/80 text-lg leading-relaxed max-w-md"
              >
                Advanced security architecture with multi-layered encryption and zero-knowledge protocols.
              </motion.p>
            </motion.div>

            {/* Right side - Feature cards */}
            <motion.div 
              className="grid md:grid-cols-1 gap-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {features.map((f, i) => (
                <FeatureCard key={i} {...f} index={i} />
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════
            SHUTTER 2 — ENCRYPTION (Full Screen GIF)
        ═══════════════════════════════════ */}
        <motion.section
          style={{ y: shutter2Y }}
          className="absolute inset-0 z-20 flex items-center justify-center px-10 md:px-32"
        >
          <div className="absolute inset-0 bg-[#A72906]" />
          <NoiseSVG />
          <GridDots color="var(--accent)" opacity={0.08} />
          <GlowOrb color="var(--accent)" size={650} top="-15%" left="25%" delay={0} />
          <GlowOrb color="var(--warning)" size={350} top="45%" left="-5%" delay={2} />

          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--accent)] via-[var(--warning)]/60 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[var(--accent)]/40 to-transparent" />

          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {/* Full Screen GIF Container */}
            <motion.div
              className="relative w-full h-full max-w-7xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* GIF without background - perfectly centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="/bg2.gif" 
                  alt="Encryption Demo"
                  className="max-w-full max-h-full object-contain"
                  onLoad={() => console.log("GIF loaded successfully")}
                  onError={() => console.log("GIF failed to load")}
                />
              </div>
              {/* Optional overlay text */}
              <div className="absolute bottom-8 left-8 text-white/80">
                <span className="text-xs font-black uppercase tracking-widest">Encryption Process Active</span>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ═══════════════════════════════════
            SHUTTER 3 — FINAL CTA (Updated Design)
        ═══════════════════════════════════ */}
        <motion.section
          style={{ y: shutter3Y }}
          className="absolute inset-0 z-30 flex items-center px-10 md:px-32"
        >
          <div className="absolute inset-0 bg-[var(--bg-primary)]" />
          <NoiseSVG />
          <GridDots color="var(--accent)" opacity={0.08} />
          <GlowOrb color="var(--accent)" size={560} top="5%" left="8%" delay={0} />
          <GlowOrb color="var(--warning)" size={440} top="30%" left="55%" delay={2} />

          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--accent)] via-[var(--warning)]/50 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[var(--accent)]/40 to-transparent" />

          <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
            {/* Label */}
            <motion.div 
              className="flex items-center justify-center gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="h-px w-10 bg-[var(--accent)]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3 }}
              />
              <motion.span 
                className="text-[10px] tracking-[0.55em] font-black text-[var(--accent)]/70 uppercase"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Ready to Deploy
              </motion.span>
              <motion.div 
                className="h-px w-10 bg-[var(--accent)]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3 }}
              />
            </motion.div>

            {/* Main heading */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-black text-[var(--text-primary)] text-center leading-tight mb-12 uppercase"
              style={{ fontFamily: '"BlockForce", monospace' }}
            >
              Initialize <br />{" "}
              <motion.span
                className="text-[var(--accent)]"
                style={{ textShadow: "0 0 40px var(--accent-light)" }}
                animate={{ 
                  textShadow: [
                    "0 0 40px var(--accent-light)",
                    "0 0 60px var(--accent-light)",
                    "0 0 40px var(--accent-light)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Secure Print
              </motion.span>
            </motion.h2>

            {/* Get Started Button */}
            <motion.button
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 100 }}
              onClick={() => navigate("/home")}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px var(--accent-light)",
                transition: { duration: 0.2, type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden group px-16 py-6 font-black uppercase tracking-[0.4em] text-white text-sm"
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)",
                clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              {/* Button content */}
              <motion.span 
                className="relative z-10 flex items-center gap-3"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                GET STARTED
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.div>
              </motion.span>
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at center, var(--accent-light) 0%, transparent 70%)",
                }}
              />
            </motion.button>
          </div>
        </motion.section>

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