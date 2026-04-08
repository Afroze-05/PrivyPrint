import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Shield, Lock, Printer, ChevronRight, ArrowRight, Zap, Globe } from "lucide-react";

const PinterestStyleHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.2,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-8, 8, -8],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-80"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex items-center justify-center min-h-screen px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Floating Elements */}
          <motion.div
            variants={floatVariants}
            initial="initial"
            animate="animate"
            className="absolute top-20 left-10 text-purple-400"
          >
            <Shield className="w-6 h-6" />
          </motion.div>
          <motion.div
            variants={floatVariants}
            initial="initial"
            animate="animate"
            className="absolute top-32 right-20 text-blue-400"
            style={{ animationDelay: "1s" }}
          >
            <Lock className="w-5 h-5" />
          </motion.div>
          <motion.div
            variants={floatVariants}
            initial="initial"
            animate="animate"
            className="absolute bottom-32 left-16 text-pink-400"
            style={{ animationDelay: "2s" }}
          >
            <Printer className="w-6 h-6" />
          </motion.div>

          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-white/80 bg-white/10 rounded-full border border-white/20 backdrop-blur-md"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Enterprise-Grade Security</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-tight"
          >
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Privy
            </span>
            <motion.span
              variants={itemVariants}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            >
              Print
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Revolutionary secure printing platform with military-grade encryption 
            and zero-trust architecture for the modern enterprise
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 text-purple-300 text-sm backdrop-blur-sm">
              🔐 256-bit Encryption
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 text-blue-300 text-sm backdrop-blur-sm">
              🛡️ Zero-Trust Security
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full border border-pink-500/30 text-pink-300 text-sm backdrop-blur-sm">
              ⚡ Lightning Fast
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px rgba(168, 85, 247, 0.5)",
                background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%)"
              }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-2xl transition-all duration-500 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-3 text-lg">
                Get Started
                <motion.div
                  animate={{ x: isHovered ? 8 : 0 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  background: isHovered 
                    ? "linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #3b82f6 100%)"
                    : "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
                }}
              />
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderColor: "rgba(255, 255, 255, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-white/10 text-white font-semibold rounded-full border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all duration-500"
            >
              <span className="flex items-center gap-3 text-lg">
                View Demo
                <ChevronRight className="w-5 h-5" />
              </span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  99.9%
                </span>
              </div>
              <div className="text-white/60 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  2s
                </span>
              </div>
              <div className="text-white/60 text-sm">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
                  1M+
                </span>
              </div>
              <div className="text-white/60 text-sm">Documents</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mouse Follow Effect */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.2s ease-out",
        }}
      />

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-sm font-medium tracking-wide">SCROLL</span>
          <ChevronRight className="w-5 h-5 rotate-90" />
        </div>
      </motion.div>
    </div>
  );
};

export default PinterestStyleHero;
