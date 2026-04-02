import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Printer, Lock, FileText, ChevronDown, Cpu, ArrowRight } from "lucide-react";

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
    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent pointer-events-none z-10"
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
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,107,53,0.08)",
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
              ? "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)"
              : "rgba(255, 107, 53, 0.1)",
            border: "1px solid rgba(255, 107, 53, 0.2)",
            borderRadius: "16px"
          }}
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <motion.div 
            style={{ color: isHovered ? "white" : "#FF6B35" }}
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

  // Smooth scroll progress with premium easing
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
      {/* Premium background elements */}
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
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Status indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#FF6B35"
            }}
          >
            <div className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
            <span className="text-sm font-medium">System Active</span>
          </motion.div>

          {/* Premium heading */}
          <motion.h1
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-bold mb-6"
            style={{
              fontFamily: '"Inter Tight", "Inter", sans-serif',
              color: "#EAEAEA",
              fontWeight: 700,
              lineHeight: 1.1
            }}
          >
            <span className="block">Privy</span>
            <motion.span
              className="block"
              style={{
                background: "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(255, 107, 53, 0.3))"
              }}
            >
              Print
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
            style={{
              fontFamily: '"Inter", sans-serif',
              color: "#999999",
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Enterprise-grade secure printing with end-to-end encryption and seamless document management
          </motion.p>

          {/* Premium CTA */}
          <motion.button
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-medium" style={{ color: "#666666" }}>Scroll</span>
          <ChevronDown className="w-5 h-5" style={{ color: "#666666" }} />
        </motion.div>
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
        <StackedCard delay={0.4} className="max-w-6xl mx-auto p-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-0.5 bg-[#FF6B35]" />
              <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#FF6B35" }}>
                Encryption Process
              </span>
              <div className="w-8 h-0.5 bg-[#FF6B35]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl font-bold mb-12"
              style={{
                fontFamily: '"Inter Tight", "Inter", sans-serif',
                color: "#EAEAEA",
                fontWeight: 700,
                lineHeight: 1.1
              }}
            >
              End-to-End{" "}
              <motion.span
                style={{
                  background: "linear-gradient(135deg, #FF6B35 0%, #FF8A50 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Protection
              </motion.span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl mx-auto h-96 flex items-center justify-center"
            >
              <img 
                src="/bg2.gif" 
                alt="Encryption Process"
                className="max-w-full max-h-full object-contain rounded-2xl"
                style={{
                  boxShadow: "0 20px 60px rgba(0,0,0,0.8)"
                }}
              />
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