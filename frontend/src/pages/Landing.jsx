import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Printer, Lock, FileText } from "lucide-react";
console.log(motion);

// Fallback background image (so the app always builds even if bg2.gif isn't present).
const bgGif =
  "data:image/gif;base64,R0lGODlhAQABAAAAACw="; // 1x1 transparent gif


function Landing() {
  const navigate = useNavigate();
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const shutterSpring = {
    mass: 1.5,
    stiffness: 100,
    damping: 12,
    restDelta: 0.001,
  };

  const rawY1 = useTransform(scrollYProgress, [0, 0.33], ["-100%", "0%"]);
  const rawY2 = useTransform(scrollYProgress, [0.33, 0.66], ["-100%", "0%"]);
  const rawY3 = useTransform(scrollYProgress, [0.66, 1], ["-100%", "0%"]);

  const shutter1Y = useSpring(rawY1, shutterSpring);
  const shutter2Y = useSpring(rawY2, shutterSpring);
  const shutter3Y = useSpring(rawY3, shutterSpring);

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-[#3BBCD9]" />, // Cyan
      title: "Encrypted Node",
      text: "Data packets are shredded post-transmission.",
    },
    {
      icon: <Printer className="w-8 h-8 text-[#3BBCD9]" />,
      title: "Physical Link",
      text: "Release only via authenticated proximity.",
    },
    {
      icon: <Lock className="w-8 h-8 text-[#3BBCD9]" />,
      title: "Zero Cache",
      text: "No residual memory left on hardware.",
    },
  ];

  return (
    <div
      ref={targetRef}
      className="relative h-[400vh] bg-[#26333B] overflow-visible font-sans"
      style={{ position: 'relative' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* === BASE LAYER: RED THEME WITH CUSTOM FONT === */}
        <section className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-[-1]">
            <img
              src={bgGif}
              alt="Background"
              className="w-full h-[100vh] object-cover  scale-98"
            />
          </div>

          <motion.div
            className="space-y-4 relative z-10 p-12 border border-[#ffffff]/20 shadow-[0_0_100px_rgba(59,188,217,0.2)] 
               rounded-[2rem] bg-[#26333B]/30 backdrop-blur-xs"
          >
            <h1
              style={{
                fontFamily:
                  '"BlockForce", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Helvetica Neue", sans-serif',
              }}
              className="text-7xl md:text-9xl font-block-force tracking-tighter text-[#D91828] uppercase drop-shadow-2xl"
            >
              Privy<span className="text-[#3BBCD9]">Print</span>
            </h1>
            <p className="text-lg md:text-xl font-bold text-[#3BBCD9] tracking-[0.5em] uppercase opacity-80">
              Privacy-Protected Printing System
            </p>
            <button
              onClick={() => navigate("/home")}
              className="btn-primary mt-8"
            >
              Start
            </button>
          </motion.div>
        </section>

        {/* === SHUTTER 1: CYAN THEME === */}
        <motion.section
          style={{ y: shutter1Y }}
          className="absolute inset-0 z-10 bg-[#3BBCD9] flex items-center px-10 md:px-32 shadow-2xl border-b-[12px] border-[#26333B]/20"
        >
          <div className="w-full max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-block-force text-[#26333B] mb-16 uppercase">
              Hardened <br /> Privacy.
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-[#26333B] p-8 border-t-8 border-[#D91828] shadow-xl"
                >
                  <div className="mb-6">{f.icon}</div>
                  <h3 className="text-xl font-black text-[#3BBCD9] mb-4 uppercase">
                    {f.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed font-medium">
                    {f.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* === SHUTTER 2: MUSTARD/GOLD THEME === */}
        <motion.section
          style={{ y: shutter2Y }}
          className="absolute inset-0 z-20 bg-[#A6831C] flex flex-col justify-center items-center px-10 border-b-[12px] border-black/30"
        >
          <div className="text-center space-y-8 bg-[#26333B] p-16 rounded-[4rem] shadow-2xl border-4 border-[#D9910D]">
            <h2 className="text-6xl md:text-8xl font-block-force text-[#D9910D] uppercase">
              Locked <span className="text-[#D91828]">Pad</span>
            </h2>
            <div className="flex justify-center gap-16 pt-10">
              <div className="text-center">
                <p className="text-[#3BBCD9] text-6xl font-black">AES</p>
                <p className="text-white/40 uppercase text-xs font-bold tracking-widest">
                  256-Bit Standard
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* === SHUTTER 3: RUST THEME === */}
        <motion.section
          style={{ y: shutter3Y }}
          className="absolute inset-0 z-30 bg-[#8C4A32] flex flex-col items-center justify-center px-10"
        >
          <div className="p-12 flex flex-col items-center bg-[#26333B] rounded-[2rem] border-b-8 border-[#D91828]">
            <FileText className="w-16 h-16 text-[#3BBCD9] mb-6" />
            <h2 className="text-5xl md:text-8xl font-block-force text-center text-white leading-tight mb-12 uppercase">
              Initialize <br />{" "}
              <span className="text-[#D91828]">Secure Print</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={() => navigate("/home")}
                className="bg-[#D91828] text-white px-14 py-5 font-black uppercase tracking-widest hover:bg-[#3BBCD9] transition-all transform hover:scale-105 active:scale-95"
              >
                START
              </button>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Floating Status Indicator */}
      <div className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-[#26333B] p-3 rounded-full border border-[#3BBCD9]/30">
        <span className="text-[10px] font-black text-[#3BBCD9] uppercase tracking-widest">
          System Live
        </span>
        <div className="w-3 h-3 bg-[#D91828] rounded-full animate-pulse shadow-[0_0_10px_#D91828]"></div>
      </div>
    </div>
  );
}

export default Landing;
