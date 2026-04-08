import { useNavigate } from "react-router-dom";
import { getAuth } from "../services/authStorage";
import { motion } from "framer-motion";
import { User, ShieldCheck, ArrowRight } from "lucide-react";

/* ── Subtle noise overlay ── */
const NoiseSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Soft dot-grid background ── */
const GridDots = ({ color = "#FF6B35", opacity = 0.03 }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
      opacity,
    }}
  />
);

/* ── Subtle glow orbs ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
    transition={{ duration: 12, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

export default function Home() {
  const navigate = useNavigate();
  const auth = getAuth();

  const cards = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Customer Portal",
      description: "Secure access to dashboard and printing services",
      accent: "#FF6B35",
      route: "/signup",
      index: 0,
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Admin Control",
      description: "Advanced administrative controls and management",
      accent: "#FFC107",
      route: "/admin/login",
      index: 1,
    },
  ];

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden font-sans"
      style={{
        background: `linear-gradient(135deg, 
          #000000 0%, 
          #0a0a0a 30%, 
          #111111 60%, 
          #0f0f0f 100%)`
      }}
    >
      {/* Subtle background elements */}
      <NoiseSVG />
      <GridDots />
      
      {/* Minimal glow orbs */}
      <GlowOrb color="rgba(255,107,53,0.06)" size={400} top="-5%" left="-5%" delay={0} />
      <GlowOrb color="rgba(255,193,7,0.04)" size={350} top="50%" left="60%" delay={3} />

      {/* Clean edge accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFC107]/20 to-transparent" />

      {/* Full screen content grid */}
      <div className="relative z-10 h-full grid grid-rows-[1fr_auto] max-w-7xl mx-auto px-6 py-8">
        {/* Main content area */}
        <div className="flex flex-col items-center justify-center">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-12"
          >
            {/* Clean eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#FF6B35]/15 bg-black/20 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-xs font-medium tracking-wide text-[#FF6B35]/80 uppercase">
                Secure Printing Platform
              </span>
            </motion.div>

            {/* Clean wordmark */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                fontFamily: '"Inter", "Satoshi", ui-sans-serif, system-ui, sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4"
            >
              Privy<span
                className="bg-gradient-to-r from-[#FF6B35] to-[#FFC107] bg-clip-text text-transparent"
              >Print</span>
            </motion.h1>

            {/* Clean subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-base sm:text-lg text-[#AAAAAA] font-normal leading-relaxed max-w-xl mx-auto mb-8"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Enterprise-grade secure printing solutions with advanced authentication
            </motion.p>
          </motion.div>

          {/* Enhanced cards section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl"
          >
            {cards.map(({ icon, title, description, accent, route, index }) => (
              <motion.div
                key={route}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                <motion.button
                  type="button"
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(route)}
                  className="relative w-full text-left p-6 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer group"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    backdropFilter: "blur(12px)",
                    borderColor: "rgba(255, 107, 53, 0.2)",
                    borderRadius: "20px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 107, 53, 0.15), 0 0 60px rgba(255, 193, 7, 0.08)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${accent}40`
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)"
                    e.currentTarget.style.boxShadow = `0 15px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(255, 107, 53, 0.3), 0 0 80px rgba(255, 193, 7, 0.15)`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.2)"
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"
                    e.currentTarget.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 107, 53, 0.15), 0 0 60px rgba(255, 193, 7, 0.08)"
                  }}
                >
                  {/* Inner light effect */}
                  <div
                    className="absolute inset-0 opacity-60 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top left, rgba(255, 193, 7, 0.12), transparent 40%)`,
                    }}
                  />
                  
                  {/* Enhanced glow overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${accent}08 0%, transparent 60%)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Enhanced icon container with glow */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                      className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300"
                      style={{
                        background: `${accent}15`,
                        borderColor: `${accent}25`,
                      }}
                    >
                      <div 
                        style={{ 
                          color: accent,
                          filter: "drop-shadow(0 0 10px rgba(255,107,53,0.5))"
                        }}
                      >
                        {icon}
                      </div>
                    </motion.div>

                    {/* Enhanced title */}
                    <h3
                      className="text-xl font-semibold text-white mb-2"
                      style={{ fontFamily: '"Inter", "Satoshi", sans-serif' }}
                    >
                      {title}
                    </h3>
                    
                    {/* Enhanced description */}
                    <p className="text-[#BBBBBB] text-sm font-normal leading-relaxed mb-4">
                      {description}
                    </p>

                    {/* Enhanced CTA with glow */}
                    <motion.div
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="text-sm font-medium transition-colors duration-300"
                        style={{ 
                          color: accent,
                          textShadow: `0 0 8px ${accent}40`
                        }}
                      >
                        Access Portal
                      </span>
                      <ArrowRight
                        className="w-4 h-4 transition-all duration-300"
                        style={{ 
                          color: accent,
                          filter: "drop-shadow(0 0 6px rgba(255,107,53,0.4))"
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex items-center justify-center"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF6B35]/15 bg-black/20 backdrop-blur-sm">
            <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-pulse" />
            <span className="text-xs font-medium text-[#AAAAAA]">
              System Online
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}