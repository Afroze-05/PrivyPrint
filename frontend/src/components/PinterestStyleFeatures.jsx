import { motion } from "framer-motion";
import { useState } from "react";
import { Shield, Lock, Printer, Zap, Globe, Database, Eye, Cpu, Cloud, Users, BarChart, Settings } from "lucide-react";

const PinterestStyleFeatures = () => {
  const [activeCard, setActiveCard] = useState(null);

  const features = [
    {
      id: 1,
      icon: <Shield className="w-8 h-8" />,
      title: "Military-Grade Security",
      description: "Advanced encryption protocols that protect your documents from unauthorized access with multi-layered security architecture.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      stats: "256-bit",
      features: ["AES-256 Encryption", "Zero-Knowledge Proof", "Multi-Factor Auth", "Audit Trails"]
    },
    {
      id: 2,
      icon: <Lock className="w-8 h-8" />,
      title: "Privacy-First Design",
      description: "Your data never leaves your control. We believe in privacy by design with local processing and zero data retention.",
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      stats: "Zero Cache",
      features: ["Local Processing", "No Data Retention", "Anonymous Printing", "Self-Destructing Docs"]
    },
    {
      id: 3,
      icon: <Printer className="w-8 h-8" />,
      title: "Smart Printing",
      description: "Intelligent printing system that adapts to your security needs with automatic watermarking and secure release.",
      color: "from-pink-500 to-blue-500",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/30",
      stats: "Instant",
      features: ["Auto Watermarking", "Secure Release", "Mobile Support", "Cloud Integration"]
    },
    {
      id: 4,
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Process and print documents in seconds without compromising security with optimized workflows.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      stats: "2 seconds",
      features: ["Instant Processing", "Real-time Encryption", "Parallel Processing", "Optimized Workflows"]
    },
    {
      id: 5,
      icon: <Globe className="w-8 h-8" />,
      title: "Global Compliance",
      description: "Meets international security standards and regulations for enterprise deployment worldwide.",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      stats: "Global",
      features: ["GDPR Compliant", "HIPAA Ready", "SOC 2 Certified", "ISO 27001 Aligned"]
    },
    {
      id: 6,
      icon: <Database className="w-8 h-8" />,
      title: "Zero Cache System",
      description: "No residual data left on any system after printing completes with complete memory sanitization.",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      stats: "Zero Trace",
      features: ["Memory Sanitization", "Secure Deletion", "No Data Traces", "Clean Exit Protocols"]
    }
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

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-20 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Advanced Features
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Cutting-edge security and printing technology designed for the modern enterprise
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              onHoverStart={() => setActiveCard(feature.id)}
              onHoverEnd={() => setActiveCard(null)}
              className="relative group"
            >
              {/* Card Background */}
              <div className={`relative h-full p-8 rounded-2xl ${feature.bgColor} border ${feature.borderColor} backdrop-blur-lg transition-all duration-500`}>
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    animate={{
                      rotate: activeCard === feature.id ? 360 : 0,
                      scale: activeCard === feature.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={`w-16 h-16 mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-2xl`}
                  >
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stats Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${feature.bgColor} border ${feature.borderColor} mb-6`}>
                    <span className={`text-sm font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      {feature.stats}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 text-white/60 text-sm"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`}></div>
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating Particles */}
                {activeCard === feature.id && (
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${feature.color}`}
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
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
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
              Explore All Features
              <Zap className="w-5 h-5" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default PinterestStyleFeatures;
