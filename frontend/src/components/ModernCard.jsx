import { motion } from "framer-motion";
import { useState } from "react";
import { Shield, Lock, Printer, Zap, Globe, Database } from "lucide-react";

const ModernCard = ({ icon, title, description, features, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: index * 0.1,
      },
    },
  };

  const hoverVariants = {
    rest: {
      scale: 1,
      rotateY: 0,
      rotateX: 0,
      z: 0,
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      rotateX: -5,
      z: 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
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
      {/* Card Background with Glass Morphism */}
      <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Inner Content */}
        <div className="relative p-8">
          {/* Icon Container */}
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
          >
            <div className="text-white text-2xl">
              {icon}
            </div>
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            {description}
          </p>

          {/* Features List */}
          {features && (
            <ul className="space-y-3">
              {features.map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
          )}

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={false}
            animate={isHovered ? "visible" : "hidden"}
          />

          {/* Floating Particles */}
          {isHovered && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  initial={{
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Feature Cards Data
const featureCards = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Military-Grade Security",
    description: "Advanced encryption protocols that protect your documents from unauthorized access.",
    features: [
      "256-bit AES encryption",
      "Zero-knowledge architecture",
      "Multi-factor authentication",
      "Audit trail logging"
    ],
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Privacy-First Design",
    description: "Your data never leaves your control. We believe in privacy by design.",
    features: [
      "Local processing only",
      "No data retention",
      "Anonymous printing",
      "Self-destructing documents"
    ],
  },
  {
    icon: <Printer className="w-8 h-8" />,
    title: "Smart Printing",
    description: "Intelligent printing system that adapts to your security needs.",
    features: [
      "Automatic watermarking",
      "Secure print release",
      "Mobile printing support",
      "Cloud integration"
    ],
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Lightning Fast",
    description: "Process and print documents in seconds without compromising security.",
    features: [
      "Instant processing",
      "Real-time encryption",
      "Parallel processing",
      "Optimized workflows"
    ],
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Compliance",
    description: "Meets international security standards and regulations.",
    features: [
      "GDPR compliant",
      "HIPAA ready",
      "SOC 2 certified",
      "ISO 27001 aligned"
    ],
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Zero Cache System",
    description: "No residual data left on any system after printing completes.",
    features: [
      "Memory sanitization",
      "Secure deletion",
      "No data traces",
      "Clean exit protocols"
    ],
  },
];

const ModernCardGrid = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Advanced Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Cutting-edge security and printing technology designed for the modern enterprise
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((card, index) => (
            <ModernCard key={index} {...card} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernCardGrid;
