import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Shield, Lock, Printer, Users, Clock, Award, TrendingUp, Globe, Zap, CheckCircle } from "lucide-react";

const AnimatedCounter = ({ target, duration = 2000, suffix = "", prefix = "" }) => {
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
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const StatCard = ({ icon, value, suffix, prefix, label, description, color, delay, trend }) => {
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
        damping: 15,
        delay,
      },
    },
  };

  const hoverVariants = {
    rest: {
      scale: 1,
      rotateY: 0,
      rotateX: 0,
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      rotateX: -5,
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
      variants={hoverVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
      style={{ perspective: "1000px" }}
    >
      {/* Card Background */}
      <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border border-white/10 shadow-2xl overflow-hidden">
        {/* Animated Gradient Overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl`}
          style={{
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center">
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
              <AnimatedCounter target={value} duration={2000} suffix={suffix} prefix={prefix} />
            </span>
          </div>

          {/* Trend */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.5 }}
              className="flex items-center justify-center gap-2 mb-3"
            >
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">{trend}</span>
            </motion.div>
          )}

          {/* Label */}
          <h3 className="text-xl font-semibold text-white mb-2">
            {label}
          </h3>

          {/* Description */}
          <p className="text-white/60 text-sm leading-relaxed">
            {description}
          </p>

          {/* Progress Bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r rounded-full"
            style={{
              background: `linear-gradient(90deg, ${color}, ${color}60)`,
              width: isHovered ? "100%" : "0%",
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Floating Particles */}
        {isHovered && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(12)].map((_, i) => (
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

const PinterestStyleStats = () => {
  const stats = [
    {
      icon: <Shield className="w-8 h-8" />,
      value: 99.9,
      suffix: "%",
      label: "Security Success Rate",
      description: "Industry-leading security with zero breaches",
      color: "#8b5cf6",
      delay: 0,
      trend: "+2.3%",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      value: 1000000,
      suffix: "+",
      label: "Documents Secured",
      description: "Trusted by enterprises worldwide",
      color: "#3b82f6",
      delay: 0.1,
      trend: "+15%",
    },
    {
      icon: <Printer className="w-8 h-8" />,
      value: 50000,
      suffix: "+",
      label: "Daily Secure Prints",
      description: "Processing documents every second",
      color: "#10b981",
      delay: 0.2,
      trend: "+8%",
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: 10000,
      suffix: "+",
      label: "Active Users",
      description: "Growing community of security professionals",
      color: "#f59e0b",
      delay: 0.3,
      trend: "+12%",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: 2,
      suffix: "s",
      label: "Avg Processing Time",
      description: "Lightning-fast secure processing",
      color: "#ef4444",
      delay: 0.4,
      trend: "-0.5s",
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: 50,
      suffix: "+",
      label: "Industry Awards",
      description: "Recognized for innovation and security",
      color: "#ec4899",
      delay: 0.5,
      trend: "+5",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="relative py-20 px-4 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/20 rounded-full filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Trusted by Thousands
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Join the growing community of security-conscious professionals who trust PrivyPrint
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Trusted by Industry Leaders
            </span>
          </h3>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {["SOC 2", "ISO 27001", "GDPR", "HIPAA", "PCI DSS"].map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-md"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">{cert}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 25px 50px rgba(168, 85, 247, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-500"
          >
            <span className="flex items-center gap-3 text-lg">
              Join the Community
              <Zap className="w-5 h-5" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default PinterestStyleStats;
