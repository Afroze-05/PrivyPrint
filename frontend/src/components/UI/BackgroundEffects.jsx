import { motion } from 'framer-motion';

// Noise grain overlay
export const NoiseSVG = () => (
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

// Dot-grid background
export const GridDots = ({ color = "#FF6A00", opacity = 0.1 }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
      opacity,
    }}
  />
);

// Ambient glow orb
export const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ scale: [1, 1.18, 1], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

// Scan-line sweep
export const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6A00]/30 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
  />
);

// Animated gradient background
export const GradientBackground = ({ children, className = '' }) => (
  <div className={`relative min-h-screen bg-gradient-to-br from-[#0B0B0B] via-[#111111] to-[#0B0B0B] overflow-hidden ${className}`}>
    <NoiseSVG />
    <GridDots />
    <ScanLine />
    <GlowOrb color="#FF6A00" size={480} top="-8%" left="-6%" delay={0} />
    <GlowOrb color="#FF8C42" size={380} top="35%" left="62%" delay={2} />
    <GlowOrb color="#FFA947" size={260} top="60%" left="18%" delay={4} />
    {children}
  </div>
);

// Floating particles
export const FloatingParticles = ({ count = 20 }) => (
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-[#FF6A00]/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -100, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

// Edge rules decorator
export const EdgeRules = ({ color = "#FF6A00" }) => (
  <>
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6A00]/25 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF8C42]/25 to-transparent" />
    <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[#FF6A00]/20 to-transparent" />
    <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-[#FF8C42]/20 to-transparent" />
  </>
);

// System tag component
export const SystemTag = ({ version = "v4.2", className = '' }) => (
  <div className={`absolute top-7 left-8 flex items-center gap-2 ${className}`}>
    <div className="w-3.5 h-3.5 text-[#FF6A00]/40">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
      </svg>
    </div>
    <span className="text-[9px] font-black tracking-[0.45em] text-white/20 uppercase">
      PrivyPrint OS {version}
    </span>
  </div>
);

// Floating status indicator
export const StatusIndicator = ({ status = "live", text = "System Live" }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1 }}
    className="fixed top-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 glass-card border border-[#FF6A00]/20 bg-[#0B0B0B]/90 backdrop-blur-md rounded-xl"
  >
    <span className="text-[10px] font-black text-[#FF6A00] uppercase tracking-[0.35em]">
      {text}
    </span>
    <div className="w-2.5 h-2.5 bg-[#FF6A00] rounded-full animate-pulse shadow-[0_0_10px_#FF6A00]" />
  </motion.div>
);

// Premium section wrapper
export const PremiumSection = ({ 
  children, 
  className = '',
  background = true,
  particles = false 
}) => (
  <section className={`relative ${className}`}>
    {background && <GradientBackground>{children}</GradientBackground>}
    {particles && <FloatingParticles />}
    {!background && children}
  </section>
);

// Eyebrow pill component
export const EyebrowPill = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.25 }}
    className={`flex items-center gap-2.5 mb-6 px-5 py-2 glass-card border border-[#FF6A00]/20 bg-[#FF6A00]/4 ${className}`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse shadow-[0_0_8px_#FF6A00]" />
    <span className="text-[9px] font-black tracking-[0.55em] text-[#FF6A00]/80 uppercase">
      {children}
    </span>
  </motion.div>
);

// Premium heading
export const PremiumHeading = ({ 
  children, 
  size = 'xl',
  className = '',
  gradient = false 
}) => {
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-5xl',
    lg: 'text-4xl md:text-6xl',
    xl: 'text-5xl md:text-7xl',
    '2xl': 'text-6xl md:text-8xl',
    '3xl': 'text-7xl md:text-9xl'
  };

  return (
    <h1
      style={{
        fontFamily: '"Poppins", ui-sans-serif, system-ui, sans-serif',
        lineHeight: 0.88,
      }}
      className={`${sizeClasses[size]} font-black tracking-tighter text-white uppercase select-none ${className} ${
        gradient ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FF8C42]' : ''
      }`}
    >
      {children}
    </h1>
  );
};
