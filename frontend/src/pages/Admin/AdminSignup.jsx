// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../services/api";
// import { motion } from "framer-motion";
// import { User, Mail, Lock, ShieldCheck, Cpu, ArrowLeft, ChevronRight } from "lucide-react";

// /* ── Noise grain overlay ── */
// const NoiseSVG = () => (
//   <svg
//     className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none z-0"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <filter id="noise">
//       <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
//       <feColorMatrix type="saturate" values="0" />
//     </filter>
//     <rect width="100%" height="100%" filter="url(#noise)" />
//   </svg>
// );

// /* ── Dot-grid background ── */
// const GridDots = ({ color = "#D91828", opacity = 0.07 }) => (
//   <div
//     className="absolute inset-0 pointer-events-none"
//     style={{
//       backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
//       backgroundSize: "36px 36px",
//       opacity,
//     }}
//   />
// );

// /* ── Ambient glow orb ── */
// const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
//   <motion.div
//     className="absolute rounded-full blur-3xl pointer-events-none"
//     style={{ width: size, height: size, top, left, background: color }}
//     animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.22, 0.12] }}
//     transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
//   />
// );

// /* ── Scan-line sweep ── */
// const ScanLine = () => (
//   <motion.div
//     className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D91828]/25 to-transparent pointer-events-none z-10"
//     animate={{ top: ["0%", "100%"] }}
//     transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
//   />
// );

// /* ── Styled input field ── */
// const Field = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required }) => (
//   <div className="flex flex-col gap-2">
//     <label className="text-[10px] font-black tracking-[0.45em] text-white/35 uppercase">
//       {label}
//     </label>
//     <div className="relative group">
//       {Icon && (
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
//           <Icon className="w-4 h-4 text-white/20 group-focus-within:text-[#D91828] transition-colors duration-300" />
//         </div>
//       )}
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         className="w-full bg-[#0E1A21] border border-white/8 text-white text-sm font-medium
//           placeholder:text-white/20 focus:outline-none focus:border-[#D91828]/50
//           transition-all duration-300 py-4 pr-4 tracking-wide"
//         style={{
//           paddingLeft: Icon ? "2.75rem" : "1rem",
//           clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
//         }}
//       />
//       <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#D91828]/0 group-focus-within:bg-[#D91828]/50 transition-all duration-300" />
//     </div>
//   </div>
// );

// export default function AdminSignup() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleCreateAccount(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await api.post("/auth/signup", { name, email, password, role: "admin" });
//       navigate("/admin/login");
//     } catch (err) {
//       setError(err?.response?.data?.message || err.message || "Signup failed.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="relative min-h-screen bg-[#0C1519] flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
//       <NoiseSVG />
//       <GridDots />
//       <ScanLine />
//       <GlowOrb color="#D91828" size={500} top="-10%" left="-6%" delay={0} />
//       <GlowOrb color="#D9910D" size={360} top="45%" left="60%" delay={2} />
//       <GlowOrb color="#3BBCD9" size={220} top="68%" left="12%" delay={4} />

//       {/* Edge rules */}
//       <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D91828]/30 to-transparent" />
//       <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#3BBCD9]/20 to-transparent" />
//       <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D91828]/20 to-transparent" />
//       <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D9910D]/20 to-transparent" />

//       {/* System tag */}
//       <div className="absolute top-7 left-8 flex items-center gap-2">
//         <Cpu className="w-3.5 h-3.5 text-[#D91828]/40" />
//         <span className="text-[9px] font-black tracking-[0.45em] text-white/20 uppercase">
//           PrivyPrint OS v4.2
//         </span>
//       </div>

//       {/* Back button */}
//       <motion.button
//         initial={{ opacity: 0, x: 10 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 0.4 }}
//         onClick={() => navigate("/admin/login")}
//         className="absolute top-7 right-8 flex items-center gap-2 text-white/20 hover:text-[#D91828] transition-colors duration-300 group"
//       >
//         <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
//         <span className="text-[9px] font-black tracking-[0.45em] uppercase">Back to Login</span>
//       </motion.button>

//       {/* Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 28 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
//         className="relative z-10 w-full max-w-md"
//       >
//         {/* Eyebrow */}
//         <motion.div
//           initial={{ opacity: 0, y: -8 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="flex items-center gap-2.5 mb-8 px-5 py-2 border border-[#D91828]/25 bg-[#D91828]/5 w-fit"
//         >
//           <span className="w-1.5 h-1.5 rounded-full bg-[#D91828] animate-pulse shadow-[0_0_8px_#D91828]" />
//           <span className="text-[9px] font-black tracking-[0.55em] text-[#D91828]/80 uppercase">
//             Restricted Access
//           </span>
//         </motion.div>

//         {/* Title */}
//         <h1
//           style={{ fontFamily: '"BlockForce", ui-sans-serif, system-ui, monospace', lineHeight: 0.88 }}
//           className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase select-none mb-5"
//         >
//           Admin{" "}
//           <span
//             className="text-[#D91828]"
//             style={{ textShadow: "0 0 45px rgba(217,24,40,0.45)" }}
//           >
//             Signup
//           </span>
//         </h1>
//         <div className="w-full h-[2px] bg-gradient-to-r from-[#D91828] via-[#D9910D] to-transparent mb-10" />

//         {/* Form panel */}
//         <div
//           className="relative bg-[#0E1A21] border border-white/6 p-8 overflow-hidden"
//           style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)" }}
//         >
//           {/* Top bar */}
//           <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D91828] via-[#D9910D] to-transparent" />
//           {/* Chamfer corner */}
//           <div className="absolute top-0 right-0 w-[24px] h-[24px] border-t border-r border-[#D91828]/30" />
//           {/* Inner ambient */}
//           <div
//             className="absolute inset-0 pointer-events-none"
//             style={{ background: "radial-gradient(ellipse at top left, rgba(217,24,40,0.04) 0%, transparent 60%)" }}
//           />

//           {/* Admin badge */}
//           <div className="flex items-center gap-3 mb-7 pb-6 border-b border-white/5">
//             <div className="p-2.5 bg-[#D91828]/10 border border-[#D91828]/20">
//               <ShieldCheck className="w-5 h-5 text-[#D91828]" />
//             </div>
//             <div>
//               <p className="text-[10px] font-black tracking-[0.4em] text-white/50 uppercase">
//                 Administrator
//               </p>
//               <p className="text-[9px] text-white/20 font-medium tracking-wider mt-0.5">
//                 Creating a privileged account
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleCreateAccount} className="flex flex-col gap-5">
//             <Field
//               label="Name"
//               icon={User}
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Your full name"
//               required
//             />

//             <Field
//               label="Email"
//               icon={Mail}
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="admin@example.com"
//               required
//             />

//             <Field
//               label="Password"
//               icon={Lock}
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Create a strong password"
//               required
//             />

//             {/* Error */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -4 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="flex items-center gap-2 px-4 py-3 border border-[#D91828]/30 bg-[#D91828]/8"
//               >
//                 <div className="w-1.5 h-1.5 rounded-full bg-[#D91828] flex-shrink-0" />
//                 <span className="text-[#D91828] text-xs font-bold">{error}</span>
//               </motion.div>
//             )}

//             {/* Submit */}
//             <motion.button
//               type="submit"
//               disabled={loading}
//               whileHover={{ scale: loading ? 1 : 1.02 }}
//               whileTap={{ scale: loading ? 1 : 0.97 }}
//               className="relative overflow-hidden group w-full py-4 font-black uppercase tracking-[0.4em] text-white text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{
//                 background: "linear-gradient(135deg, #D91828 0%, #a81220 100%)",
//                 clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
//               }}
//             >
//               <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
//               <span className="relative z-10 flex items-center justify-center gap-2">
//                 {loading ? (
//                   <>
//                     <motion.span
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                       className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
//                     />
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     Create Account <ChevronRight className="w-4 h-4" />
//                   </>
//                 )}
//               </span>
//             </motion.button>
//           </form>

//           {/* Divider */}
//           <div className="flex items-center gap-3 my-6">
//             <div className="flex-1 h-[1px] bg-white/6" />
//             <span className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">or</span>
//             <div className="flex-1 h-[1px] bg-white/6" />
//           </div>

//           {/* Go to login */}
//           <div className="flex items-center justify-between">
//             <span className="text-[10px] font-black tracking-[0.25em] text-white/20 uppercase">
//               Already have an account?
//             </span>
//             <button
//               type="button"
//               onClick={() => navigate("/admin/login")}
//               className="flex items-center gap-1.5 text-[10px] font-black tracking-[0.3em] uppercase text-white/30 hover:text-[#D91828] transition-colors duration-300 group"
//             >
//               Go to Login
//               <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
//             </button>
//           </div>
//         </div>
//       </motion.div>

//       {/* Floating status indicator */}
//       <motion.div
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: 1 }}
//         className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-2.5 border border-[#D91828]/20 bg-[#0C1519]/90 backdrop-blur-md"
//         style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
//       >
//         <span className="text-[10px] font-black text-[#D91828] uppercase tracking-[0.35em]">
//           System Live
//         </span>
//         <div className="w-2.5 h-2.5 bg-[#D91828] rounded-full animate-pulse shadow-[0_0_10px_#D91828]" />
//       </motion.div>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { motion } from "framer-motion";
import { User, Mail, Lock, ShieldCheck, Cpu, ArrowLeft, ChevronRight } from "lucide-react";

// Import your logo exactly like the Login page
import logoImg from "../../assets/logo1.png";

/* ── UI Components ── */
const NoiseSVG = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

const GridDots = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
    style={{ backgroundImage: `radial-gradient(circle, #f26716 1px, transparent 1px)`, backgroundSize: "36px 36px" }}
  />
);

const Field = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required }) => (
  <div className="flex flex-col gap-2.5">
    <label className="text-[11px] font-black tracking-[0.45em] text-white/30 uppercase pl-1">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Icon className="w-5 h-5 text-white/20 group-focus-within:text-[#f26716] transition-colors duration-300" />
        </div>
      )}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full bg-[#0d0d0d] border border-white/5 text-white text-lg font-medium
          placeholder:text-white/20 focus:outline-none focus:border-[#f26716]/50
          transition-all duration-300 py-5 pr-4 tracking-wide shadow-inner"
        style={{
          paddingLeft: Icon ? "3rem" : "1.25rem",
          clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
        }}
      />
    </div>
  </div>
);

export default function AdminSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateAccount(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/signup", { name, email, password, role: "admin" });
      navigate("/admin/login");
    } catch (err) {
      setError(err?.response?.data?.message || "REGISTRATION FAILED: AUTH_ERROR");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
      <NoiseSVG />
      <GridDots />
      
      {/* ── TOP HEADER (Matched to Login) ── */}
      <div className="flex flex-col items-center mb-8 text-center relative z-10">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-64 h-32 mb-1 flex items-center justify-center"
        >
          <img src={logoImg} alt="PrivyPrint" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(242,103,22,0.4)]" />
        </motion.div>
        
        <h1 className="text-white font-black text-5xl tracking-tighter mb-0 uppercase leading-none">
          Admin <span className="text-[#f26716]">Signup</span>
        </h1>
        <p className="text-white/40 text-[14px] font-bold uppercase tracking-[0.5em] mt-2">
          Establish Secure Credentials
        </p>
      </div>

      {/* ── MAIN FORM BOX ── */}
      {/* ── MAIN FORM BOX ── */}
<div 
  /* Changed max-w-sm to max-w-md for better width (448px) */
  /* Added bg opacity and backdrop-blur for glassmorphism */
  className="relative z-10 bg-[#0d0d0d]/80 backdrop-blur-xl border border-white/10 p-10 shadow-2xl shadow-black/50 w-full max-w-md mx-auto"
  style={{ 
    clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
    /* Adding the subtle inner glow from your orange palette */
    boxShadow: "inset 0 0 20px rgba(242, 103, 22, 0.05), 0 20px 50px rgba(0,0,0,0.5)"
  }}
>
        <form onSubmit={handleCreateAccount} className="space-y-6">
          <Field
            label="Username "
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Admin"
            required
          />
          <Field
            label="Admin Identifier"
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@privyprint.com"
            required
          />
          <Field
            label="Master Password"
            icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] p-3 font-black uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#f26716] hover:bg-[#a62f03] text-white font-black py-5 px-6 
              transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-[#f26716]/20 mt-4"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
          >
            {loading ? <Cpu className="animate-spin" /> : <span className="tracking-[0.2em] text-base uppercase">Authorize Account</span>}
            {!loading && <ChevronRight className="w-5 h-5" />}
          </motion.button>
        </form>

        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-[1px] bg-white/5" />
          <span className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Verify</span>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        <button
          onClick={() => navigate("/admin/login")}
          className="w-full border border-white/10 hover:border-[#f26716]/50 text-white/40 hover:text-white py-4 px-6 
            transition-all duration-300 text-[11px] font-black uppercase tracking-[0.4em]"
          style={{ clipPath: "polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)" }}
        >
          Return to Portal
        </button>
      </div>

      <div className="mt-8 relative z-10 flex items-center gap-2">
        <div className="w-2 h-2 bg-[#f26716] rounded-full animate-pulse shadow-[0_0_10px_#f26716]" />
        <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
          System Status: Encryption Ready
        </span>
      </div>
    </div>
  );
}