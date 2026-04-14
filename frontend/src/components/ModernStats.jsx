import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Shield, Lock, Printer, Users, Clock, Award } from "lucide-react";

const AnimatedCounter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * target);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isVisible, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatCard = ({ icon, value, suffix, label, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay,
      },
    },
  };

  const hoverVariants = {
    rest: {
      y: 0,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Card Background */}
      <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Icon */}
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color}, ${color}80)`,
            }}
          >
            <div className="text-white text-2xl">
              {icon}
            </div>
          </motion.div>

          {/* Value */}
          <div className="text-4xl md:text-5xl font-bold text-white mb-2">
            <span style={{ color }}>
              <AnimatedCounter target={value} duration={2000} suffix={suffix} />
            </span>
          </div>

          {/* Label */}
          <p className="text-gray-300 text-lg font-medium">
            {label}
          </p>

          {/* Progress Bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r rounded-full"
            style={{
              background: `linear-gradient(90deg, ${color}, ${color}60)`,
              width: isHovered ? "100%" : "0%",
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Floating Particles */}
        {isHovered && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: color }}
                initial={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 100,
                  y: Math.random() * 100,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5 + Math.random() * 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ModernStats = () => {
  const stats = [
    {
      icon: <Shield className="w-8 h-8" />,
      value: 99.9,
      suffix: "%",
      label: "Security Success Rate",
      color: "#8b5cf6",
      delay: 0,
    },
    {
      icon: <Lock className="w-8 h-8" />,
      value: 1000000,
      suffix: "+",
      label: "Documents Secured",
      color: "#3b82f6",
      delay: 0.1,
    },
    {
      icon: <Printer className="w-8 h-8" />,
      value: 50000,
      suffix: "+",
      label: "Secure Prints Daily",
      color: "#10b981",
      delay: 0.2,
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: 10000,
      suffix: "+",
      label: "Active Users",
      color: "#f59e0b",
      delay: 0.3,
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: 2,
      suffix: "s",
      label: "Average Processing Time",
      color: "#ef4444",
      delay: 0.4,
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: 50,
      suffix: "+",
      label: "Industry Awards",
      color: "#ec4899",
      delay: 0.5,
    },
  ];

  return (
    <div className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full filter blur-3xl animate-float animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Trusted by Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join the growing community of security-conscious professionals who trust PrivyPrint
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            Join the Community
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernStats;
