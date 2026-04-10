
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Printer, Lock, FileText, ChevronDown, Cpu, ArrowRight } from "lucide-react";
import logo2  from "../assets/logo2.png";

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

/* ── Ambient glow orb with subtle animation ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{
      scale: [1, 1.1, 1.05, 1.15, 1],
      opacity: [0.08, 0.12, 0.1, 0.15, 0.08],
      x: [0, 10, -5, 8, 0],
      y: [0, -8, 5, -3, 0],
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

/* ── Scan-line sweep ── */
const ScanLine = () => (
  <motion.div
    className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[var(--accent)]/30 to-transparent pointer-events-none z-10"
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
  />
);
/* ── Premium Stacked Card Component ── */
const StackedCard = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={`relative backdrop-blur-xl border transition-all duration-500 ${className}`}
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)",
        willChange: "transform"
      }}
    >
      {children}
    </motion.div>
  );
};

/* ── Enhanced Feature card with premium design ── */
const FeatureCard = ({ icon, title, text, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.15, 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: -6,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative backdrop-blur-xl p-8 border transition-all duration-300 overflow-hidden"
      style={{ 
        // background: "rgba(255,255,255,0.03)",
        // background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(0,0,0,0.6))",
        background: "radial-gradient(ellipse at center, rgba(255, 107, 53, 0.15) 0%, transparent 70%)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,107,53,0.2)",
        borderRadius: "34px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 50px rgba(255,107,53,0.08)",
        willChange: "transform"
      }}
    >
      {/* Subtle glow on hover */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl"
        style={{ 
          background: "radial-gradient(ellipse at center, rgba(255, 107, 53, 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* Premium icon */}
        <motion.div 
          className="mb-6 w-fit p-4 rounded-2xl"
          style={{
            background: isHovered 
              ? "linear-gradient(135deg, #ffffff 0%, #FF8A50 100%)"
              : "rgba(255, 107, 53, 0.2)",
            border: "1px solid rgba(255, 107, 53, 0.4)",
            borderRadius: "16px"
          }}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <motion.div 
            style={{ color: isHovered ? "#ffffff" : "#FF8A50" }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        </motion.div>
        
        {/* Clean typography */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 + 0.2, duration: 0.6 }}
          className="text-xl font-semibold mb-3"
          style={{ 
            fontFamily: '"Inter Tight", "Inter", sans-serif',
            color: "#EAEAEA",
            fontWeight: 600,
            letterSpacing: "-0.01em"
          }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
          className="leading-relaxed text-base"
          style={{ 
            fontFamily: '"Inter", sans-serif',
            color: "#999999",
            lineHeight: 1.6,
            fontWeight: 400
          }}
        >
          {text}
        </motion.p>
      </div>
    </motion.div>
  );
};

function Landing() {
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  // Smooth scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 25,
    mass: 1,
    restDelta: 0.001
  });

  const shutterSpring = { mass: 1, stiffness: 40, damping: 25, restDelta: 0.001 };

  const rawY1 = useTransform(smoothProgress, [0, 0.33], ["-100%", "0%"]);
  const rawY2 = useTransform(smoothProgress, [0.33, 0.66], ["-100%", "0%"]);
  const rawY3 = useTransform(smoothProgress, [0.66, 1], ["-100%", "0%"]);

  const shutter1Y = useSpring(rawY1, shutterSpring);
  const shutter2Y = useSpring(rawY2, shutterSpring);
  const shutter3Y = useSpring(rawY3, shutterSpring);

  // Premium parallax effect for background elements
  const parallaxY = useTransform(smoothProgress, [0, 1], [0, -30]);

  // Section scale transforms for stacking illusion
  const sectionScale = useTransform(smoothProgress, [0, 0.33, 0.66, 1], [1, 0.98, 0.96, 0.94]);

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
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0a0a0a 50%, #111111 100%)",
        scrollBehavior: "smooth",
        scrollSnapType: "y mandatory"
      }}
    >
      {/* Premium bg elements */}
      <div className="fixed inset-0 pointer-events-none">
        <NoiseSVG />
        <motion.div style={{ y: parallaxY }} className="absolute inset-0">
          <GridDots color="#FF6B35" opacity={0.05} />
        </motion.div>
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-0"
        >
          <GlowOrb color="#FF6B35" size={600} top="-10%" left="-5%" delay={0} />
          <GlowOrb color="#FF8A50" size={400} top="40%" left="60%" delay={3} />
        </motion.div>
      </div>

{/* Hero Section */}
<section className="relative min-h-screen flex items-center justify-center px-6" style={{ scrollSnapAlign: "start" }}>
  {/* Top Left */}
  <div className="absolute top-6 left-6 flex items-center gap-2">
    <Cpu className="w-3 h-3 text-[var(--accent)]/40" />
    <span className="text-[10px] tracking-[0.4em] text-[var(--text-muted)] uppercase">
      PRIVYPRINT OS v4.2
    </span>
  </div>

  {/* Top Right */}
  <div className="absolute top-6 right-6 px-4 py-2 bg-black/40 border border-[var(--accent)]/20 text-xs tracking-widest text-[var(--accent)] uppercase">
    SYSTEM LIVE
  </div>

  <div className="relative z-10 text-center">
    {/* Logo */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="flex justify-center mb-6"
    >
      <img 
        src={logo2} 
        alt="PrivyPrint Logo" 
        className="h-18 w-auto object-contain" 
      />
    </motion.div>

    {/* Badge */}
    <div className="mb-6 px-6 py-2 border border-[var(--accent)]/20 inline-flex items-center gap-2">
      <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
      <span className="text-xs tracking-[0.4em] text-[var(--accent)] uppercase">
        Secure Channel Active
      </span>
    </div>

    {/* Heading */}
    <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tight">
      <span className="text-white">PRIVY</span>
      <span className="text-[var(--accent)]">PRINT</span>
    </h1>

    {/* Subtitle */}
    <p className="mt-6 text-[var(--accent)] tracking-[0.4em] uppercase text-sm opacity-70">
      PRIVACY-PROTECTED PRINTING SYSTEM
    </p>

    {/* Line */}
    <div className="mt-6 h-[1px] w-80 mx-auto bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

    <button
      onClick={() => navigate("/home")}
      className="mt-8 px-12 py-4 uppercase tracking-[0.3em] font-bold text-white rounded-full transition-all duration-300 hover:scale-105"
      style={{
        background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
      }}
    >
      START →
    </button>

    {/* Scroll */}
    <div className="mt-10 flex flex-col items-center text-white/30 text-xs">
      <span>SCROLL</span>
      <ChevronDown className="w-4 h-4 mt-1 animate-bounce" />
    </div>
  </div>
</section>

{/* Features Section - Stacked Card */}
<section className="relative min-h-screen flex items-center justify-center px-6 py-24" style={{ scrollSnapAlign: "start" }}>
  <StackedCard delay={0.2} className="max-w-6xl mx-auto p-16">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      {/* Left content */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-0.5 bg-[#FF6B35]" />
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#FF6B35" }}>
            Core Features
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-6xl font-bold mb-6"
          style={{
            fontFamily: '"Inter Tight", "Inter", sans-serif',
            color: "#EAEAEA",
            fontWeight: 700,
            lineHeight: 1.1
          }}
        >
          Advanced{" "}
          <motion.span
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Security
          </motion.span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg leading-relaxed"
          style={{
            fontFamily: '"Inter", sans-serif',
            color: "#999999",
            lineHeight: 1.6
          }}
        >
          Multi-layered encryption with zero-knowledge protocols ensures your documents remain completely secure from transmission to printing.
        </motion.p>
      </motion.div>

      {/* Right - Feature cards */}
      <div className="space-y-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} index={index} />
        ))}
      </div>
    </div>
  </StackedCard>
</section>

{/* Encryption Section - Stacked Card */}
<section className="relative min-h-screen flex items-center justify-center px-6 py-24" style={{ scrollSnapAlign: "start" }}>
  <StackedCard delay={0.4} className="max-w-6xl mx-auto p-12 md:p-16">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      
      {/* Left Column: Text Content */}
      <div className="text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-[2px] bg-linear-to-r from-[#FF6B35] to-transparent" />
          <span className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: "#FF6B35" }}>
            Encryption Process
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-4xl md:text-5xl font-black mb-6 leading-tight text-white uppercase"
          style={{ fontFamily: '"Inter Tight", sans-serif' }}
        >
          End-to-End <br />
          <span style={{ 
            background: "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Protection
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-gray-400 text-lg leading-relaxed max-w-md"
        >
          Our proprietary protocol shreds data into encrypted packets that exist only for the duration of the print job. No logs, no trace, no compromise.
        </motion.p>
      </div>

      {/* Right Column: Visual Element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 20 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative group"
      >
        {/* Decorative Outer Glow for the Image */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#FF6B35]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm p-4">
          
          
       
<div
  style={{
    borderRadius: "10px",  
    padding: "3px",    
    background: "linear-gradient(135deg, rgba(255,107,53,0.6), rgba(255,107,53,0.1))",
    boxShadow: "0 0 40px rgba(255,107,53,0.3)"
  }}
>
  <img 
    src="/bg2.gif"
    alt="Encryption Process"
    className="w-full h-full object-contain rounded-[8px]"
  />
</div>
          
          {/* Subtle Scanline Overlay on the GIF */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
        </div>
      </motion.div>

    </div>
  </StackedCard>
</section>


      {/* CTA Section - Stacked Card */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24" style={{ scrollSnapAlign: "start" }}>
        <StackedCard delay={0.6} className="max-w-4xl mx-auto p-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-0.5 bg-[#FF6B35]" />
            <span className="text-sm font-semibold tracking-wide" style={{ color: "#FF6B35" }}>
              Ready to Deploy
            </span>
            <div className="w-8 h-0.5 bg-[#FF6B35]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-bold mb-8"
            style={{
              fontFamily: '"Inter Tight", "Inter", sans-serif',
              color: "#EAEAEA",
              fontWeight: 700,
              lineHeight: 1.1
            }}
          >
            Initialize{" "}
            <motion.span
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              Secure Print
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl mb-12"
            style={{
              fontFamily: '"Inter", sans-serif',
              color: "#999999",
              lineHeight: 1.6
            }}
          >
            Get started with enterprise-grade secure printing in minutes
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate("/home")}
            whileHover={{ 
              y: -4,
              scale: 1.02,
              boxShadow: "0 20px 60px rgba(255, 107, 53, 0.3)",
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-12 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
              fontFamily: '"Inter Tight", "Inter", sans-serif',
              fontSize: "16px",
              fontWeight: 600
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </span>
            {/* Hover overlay */}
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
          </motion.button>
        </StackedCard>
      </section>
    </div>
  );
}

export default Landing;
