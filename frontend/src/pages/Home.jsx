import { useNavigate } from "react-router-dom";
import { getAuth } from "../services/authStorage";
import { motion } from "framer-motion";
import { User, ShieldCheck, Cpu, ChevronRight } from "lucide-react";

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
const GridDots = ({ color = "#3BBCD9", opacity = 0.08 }) => (
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

export default function Home() {
  const navigate = useNavigate();
  const auth = getAuth();

  const cards = [
    {
      icon: <User className="w-8 h-8 text-[#3BBCD9]" />,
      title: "Login as Customer",
      description: "Customer Signup / Login page",
      accent: "#3BBCD9",
      route: "/signup",
      index: 0,
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#D91828]" />,
      title: "Login as Admin",
      description: "Admin Login Page",
      accent: "#D91828",
      route: "/admin/login",
      index: 1,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0C1519] flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
      <NoiseSVG />
      <GridDots />
      <ScanLine />
      <GlowOrb color="#D91828" size={420} top="-8%" left="-5%" delay={0} />
      <GlowOrb color="#3BBCD9" size={360} top="40%" left="60%" delay={2} />
      <GlowOrb color="#D9910D" size={240} top="65%" left="15%" delay={4} />

      {/* Edge rules */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3BBCD9]/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D91828]/25 to-transparent" />
      <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[#3BBCD9]/20 to-transparent" />
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D91828]/20 to-transparent" />

      {/* Top system tag */}
      <div className="absolute top-7 left-8 flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-[#3BBCD9]/40" />
        <span className="text-[9px] font-black tracking-[0.45em] text-white/20 uppercase">
          PrivyPrint OS v4.2
        </span>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl flex flex-col items-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2.5 mb-8 px-5 py-2 border border-[#3BBCD9]/20 bg-[#3BBCD9]/4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D91828] animate-pulse shadow-[0_0_8px_#D91828]" />
          <span className="text-[9px] font-black tracking-[0.55em] text-[#3BBCD9]/80 uppercase">
            Select Access Mode
          </span>
        </motion.div>

        {/* Wordmark */}
        <h1
          style={{
            fontFamily: '"BlockForce", ui-sans-serif, system-ui, monospace',
            lineHeight: 0.88,
          }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase select-none mb-3 text-center"
        >
          Privy<span
            className="text-[#3BBCD9]"
            style={{ textShadow: "0 0 45px rgba(59,188,217,0.4)" }}
          >Print</span>
        </h1>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mt-8 mb-10" />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {cards.map(({ icon, title, description, accent, route, index }) => (
            <motion.button
              key={route}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.12, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(route)}
              className="group relative text-left bg-[#0E1A21] p-8 border border-white/6 hover:border-opacity-40 transition-all duration-300 overflow-hidden cursor-pointer"
              style={{
                clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${accent}55`}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
            >
              {/* Top color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500"
                style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
              />
              {/* Chamfer corner */}
              <div
                className="absolute top-0 right-0 w-[22px] h-[22px] border-t border-r transition-colors duration-300"
                style={{ borderColor: `${accent}55` }}
              />
              {/* Inner glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top left, ${accent}0d 0%, transparent 65%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                <div
                  className="mb-5 w-fit p-3 border transition-colors duration-300"
                  style={{
                    background: `${accent}10`,
                    borderColor: `${accent}20`,
                  }}
                >
                  {icon}
                </div>

                <h3
                  className="text-base font-black text-white mb-2 uppercase tracking-widest"
                  style={{ fontFamily: '"BlockForce", monospace' }}
                >
                  {title}
                </h3>
                <p className="text-white/35 text-sm font-medium leading-relaxed">
                  {description}
                </p>

                {/* Arrow */}
                <div className="flex items-center gap-1 mt-5">
                  <span
                    className="text-[10px] font-black tracking-[0.35em] uppercase transition-colors duration-300"
                    style={{ color: `${accent}60` }}
                  >
                    Enter
                  </span>
                  <ChevronRight
                    className="w-3.5 h-3.5 transition-all duration-300 group-hover:translate-x-1"
                    style={{ color: `${accent}60` }}
                  />
                </div>
              </div>

              {/* Index number */}
              <div className="absolute bottom-4 right-5 text-[10px] font-black text-white/8 tracking-widest">
                0{index + 1}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Floating status indicator */}
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