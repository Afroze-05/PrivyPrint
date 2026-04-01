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
const GridDots = ({ color = "rgba(242, 103, 22, 0.12)", opacity = 0.08 }) => (
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
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-rgba(242, 103, 22, 0.25) via-rgba(242, 103, 22, 0.25) to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
  />
);

export default function Home() {
  const navigate = useNavigate();
  const auth = getAuth();

  const cards = [
    {
      icon: <User className="w-8 h-8 text-[#f26716]" />,
      title: "Login as Customer",
      description: "Customer Signup / Login page",
      accent: "#f26716",
      route: "/signup",
      index: 0,
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#a62f03]" />,
      title: "Login as Admin",
      description: "Admin Login Page",
      accent: "#a62f03",
      route: "/admin/login",
      index: 1,
    },
  ];

  return (
    <div
      className="relative min-h-screen bg-[#0d0d0d] bg-gradient-to-b from-[#0d0d0d] to-[#260101] flex flex-col items-center justify-center px-6 overflow-hidden font-sans"
      style={{ backgroundBlendMode: "darken" }}
    >
      <NoiseSVG />
      <GridDots />
      <ScanLine />
      <GlowOrb color="#f26716" size={420} top="-8%" left="-5%" delay={0} />
      <GlowOrb color="#a62f03" size={360} top="40%" left="60%" delay={2} />

      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-rgba(242, 103, 22, 0.25) to-transparent" />

      {/* Top system tag */}
      <div className="absolute top-7 left-8 flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-[#f26716]/40" />
        <span className="text-[9px] font-black tracking-[0.45em] text-[#f26716]/80 uppercase">
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
          className="flex items-center gap-2.5 mb-8 px-5 py-2 border border-rgba(255, 157, 0, 0.3) bg-rgba(255, 251, 238, 0.4)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rgba(242, 103, 22, 0.5) animate-pulse shadow-[0_0_8px_rgba(242, 103, 22, 0.5)]" />
          <span className="text-[9px] font-black tracking-[0.55em] text-rgba(255, 251, 238, 0.8) uppercase">
            Select Access Mode
          </span>
        </motion.div>

        {/* Wordmark */}
        <h1
          style={{
            fontFamily: '"BlockForce", ui-sans-serif, system-ui, monospace',
            lineHeight: 0.88,
          }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-[#ffffff] uppercase select-none mb-3 text-center"
        >
          Privy<span
            className="text-[#f26716]"
            style={{ textShadow: "0 0 45px rgba(242, 103, 22, 0.4)" }}
          >Print</span>
        </h1>

        {/* Divider */}
        <div
          className="w-full h-[1px] bg-gradient-to-r from-rgba(242, 103, 22, 0.25) via-rgba(242, 103, 22, 0.25) to-transparent mt-8 mb-10"
          style={{
            backgroundBlendMode: "darken",
          }}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {cards.map(({ icon, title, description, accent, route, index }) => (
            <motion.button
              key={route}
              type="button"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => navigate(route)}
              className="group relative w-full p-6 rounded-xl border border-[rgba(242,103,22,0.25)] bg-[rgba(13,13,13,0.6)] backdrop-blur-sm hover:border-[rgba(242,103,22,0.4)] hover:bg-[rgba(242,103,22,0.05)] transition-all duration-300 text-left overflow-hidden"
            >
              {/* Glow effect on hover */}
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${accent}15 0%, transparent 70%)`,
                }}
              />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[rgba(242,103,22,0.1)] border border-[rgba(242,103,22,0.2)]">
                    {icon}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[rgba(242,103,22,0.6)] group-hover:text-[rgba(242,103,22,0.9)] transition-colors duration-300 ml-auto" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-[rgba(255,255,255,0.6)] text-sm leading-relaxed">{description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}