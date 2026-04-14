import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Shield, Printer, Lock, ChevronDown, Cpu, ArrowRight } from "lucide-react";

/* ---------- Reusable Components ---------- */

// Background dots
const GridDots = () => (
  <div
    className="absolute inset-0 opacity-10"
    style={{
      backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)",
      backgroundSize: "36px 36px",
    }}
  />
);

// Feature Card
const FeatureCard = ({ icon, title, text }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05 }}
    className="p-6 rounded-2xl border bg-white/5 backdrop-blur-md"
  >
    <div className="mb-4 text-[#FF6B35]">{icon}</div>
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-gray-400 mt-2">{text}</p>
  </motion.div>
);

/* ---------- Main Component ---------- */

function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield size={28} />,
      title: "Encrypted Node",
      text: "Data is securely transmitted.",
    },
    {
      icon: <Printer size={28} />,
      title: "Physical Link",
      text: "Print only when you are near.",
    },
    {
      icon: <Lock size={28} />,
      title: "Zero Cache",
      text: "No data stored after printing.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden">

      {/* Background */}
      <GridDots />

      {/* ---------- HERO SECTION ---------- */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">

        {/* Top Left */}
        <div className="absolute top-6 left-6 flex items-center gap-2 text-xs text-gray-400">
          <Cpu size={14} />
          PRIVYPRINT OS v4.2
        </div>

        {/* Top Right */}
        <div className="absolute top-6 right-6 text-xs border px-3 py-1 text-[#FF6B35]">
          SYSTEM LIVE
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold">
          <span>PRIVY </span>
          <span className="text-[#FF6B35]">PRINT</span>
        </h1>

        <p className="mt-4 text-sm text-gray-400 tracking-widest">
          PRIVACY-PROTECTED PRINTING SYSTEM
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/home")}
          className="mt-6 px-10 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] rounded-full"
        >
          START →
        </button>

        {/* Scroll */}
        <div className="mt-10 text-gray-500 text-xs flex flex-col items-center">
          SCROLL
          <ChevronDown className="animate-bounce mt-1" />
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="py-20 px-6 max-w-5xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-10">
          Advanced <span className="text-[#FF6B35]">Security</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* ---------- ENCRYPTION IMAGE ---------- */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          End-to-End <span className="text-[#FF6B35]">Protection</span>
        </h2>

        <img
          src="/bg2.gif"
          alt="Encryption"
          className="mx-auto rounded-xl max-w-3xl"
        />
      </section>

      {/* ---------- CTA ---------- */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Initialize <span className="text-[#FF6B35]">Secure Print</span>
        </h2>

        <p className="text-gray-400 mb-8">
          Start secure printing in minutes
        </p>

        <button
          onClick={() => navigate("/home")}
          className="px-10 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF8A50] rounded-xl flex items-center gap-2 mx-auto"
        >
          Get Started <ArrowRight size={18} />
        </button>
      </section>

    </div>
  );
}

export default Landing;