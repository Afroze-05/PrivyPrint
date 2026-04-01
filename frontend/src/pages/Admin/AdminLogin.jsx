// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../services/api";
// import { setAuth } from "../../services/authStorage";
// import { motion } from "framer-motion";
// import { Mail, Lock, ShieldCheck, Cpu, ArrowLeft, ChevronRight } from "lucide-react";

// /* ── Noise grain overlay ── */
// const NoiseSVG = () => (
//   <svg
//     className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none z-0"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <filter id="noise">
//       <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
//       <feColorMatrix type="saturate" values="0" />
//     </filter>
//     <rect width="100%" height="100%" filter="url(#noise)" />
//   </svg>
// );

// const GridDots = ({ color = "#f26716", opacity = 0.07 }) => (
//   <div
//     className="absolute inset-0 pointer-events-none"
//     style={{
//       backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
//       backgroundSize: "36px 36px",
//       opacity,
//     }}
//   />
// );

// const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
//   <motion.div
//     className="absolute rounded-full blur-3xl pointer-events-none"
//     style={{ width: size, height: size, top, left, background: color }}
//     animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.22, 0.12] }}
//     transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
//   />
// );

// const ScanLine = () => (
//   <motion.div
//     className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-#f26716 to-transparent pointer-events-none z-10"
//     animate={{ top: ["0%", "100%"] }}
//     transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
//   />
// );

// const Field = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required }) => (
//   <div className="flex flex-col gap-2">
//     <label className="text-[10px] font-black tracking-[0.45em] text-white/50 uppercase">
//       {label}
//     </label>
//     <div className="relative group">
//       {Icon && (
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
//           <Icon className="w-4 h-4 text-white/50 group-focus-within:text-#f26716 transition-colors duration-300" />
//         </div>
//       )}
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         className="w-full bg-#0d0d0d border border-white/10 text-white text-sm font-medium
//           placeholder:text-white/50 focus:outline-none focus:border-#f26716/50
//           transition-all duration-300 py-4 pr-4 tracking-wide"
//         style={{
//           paddingLeft: Icon ? "2.75rem" : "1rem",
//           clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
//         }}
//       />
//       <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-#f26716/0 group-focus-within:bg-#f26716/50 transition-all duration-300" />
//     </div>
//   </div>
// );

// export default function AdminLogin() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleLogin(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const res = await api.post("/auth/login", { email, password });
//       const { token, user } = res.data;

//       if (user.role !== "admin") {
//         setError("Access denied. Admin account required.");
//         return;
//       }

//       setAuth({ token, ...user });
//       navigate("/admin/dashboard");
//     } catch (err) {
//       setError(err?.response?.data?.message || err.message || "Login failed.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="relative min-h-screen bg-#0d0d0d flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
//       <NoiseSVG />
//       <GridDots />
//       <ScanLine />
//       <GlowOrb color="#f26716" size={480} top="-10%" left="-6%" delay={0} />
//       <GlowOrb color="#a62f03" size={360} top="45%" left="58%" delay={2} />
//       <GlowOrb color="#591202" size={220} top="68%" left="12%" delay={4} />

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="relative z-10 w-full max-w-md"
//       >
//         <div className="mb-8 text-center">
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-#f26716/10 border border-#f26716/20"
//           >
//             <ShieldCheck className="w-8 h-8 text-#f26716" />
//           </motion.div>
//           <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
//             ADMIN ACCESS
//           </h1>
//           <p className="text-white/50 text-sm font-medium">
//             Enter your credentials to access the admin panel
//           </p>
//         </div>

//         <motion.form
//           onSubmit={handleLogin}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className="space-y-6"
//         >
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
//             >
//               {error}
//             </motion.div>
//           )}

//           <Field
//             label="Email Address"
//             icon={Mail}
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="admin@example.com"
//             required
//           />

//           <Field
//             label="Password"
//             icon={Lock}
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//             required
//           />

//           <motion.button
//             type="submit"
//             disabled={loading}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="w-full relative overflow-hidden group bg-#f26716 text-white font-black py-4 px-6 rounded-lg
//               transition-all duration-300 hover:bg-#f26716/90 disabled:opacity-50 disabled:cursor-not-allowed
//               tracking-wider text-sm shadow-lg shadow-#f26716/25"
//           >
//             <span className="relative z-10 flex items-center justify-center gap-2">
//               {loading ? (
//                 <>
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                     className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
//                   />
//                   AUTHENTICATING...
//                 </>
//               ) : (
//                 <>
//                   SECURE LOGIN
//                   <ChevronRight className="w-4 h-4" />
//                 </>
//               )}
//             </span>
//             <div className="absolute inset-0 bg-gradient-to-r from-#f26716 to-#a62f03 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//           </motion.button>
//         </motion.form>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.5 }}
//           className="mt-8 text-center"
//         >
//           <button
//             onClick={() => navigate("/")}
//             className="inline-flex items-center gap-2 text-white/50 hover:text-#f26716 transition-colors duration-300 text-sm font-medium"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Home
//           </button>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// } 
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../services/api";
// import { setAuth } from "../../services/authStorage";
// import { motion } from "framer-motion";
// import { Mail, Lock, ShieldCheck, Cpu, ArrowLeft, ChevronRight } from "lucide-react";

// /* ── Noise grain overlay ── */
// const NoiseSVG = () => (
//   <svg
//     className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none z-0"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <filter id="noise">
//       <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
//       <feColorMatrix type="saturate" values="0" />
//     </filter>
//     <rect width="100%" height="100%" filter="url(#noise)" />
//   </svg>
// );

// const GridDots = () => (
//   <div
//     className="absolute inset-0 pointer-events-none opacity-[0.07]"
//     style={{
//       backgroundImage: `radial-gradient(circle, var(--accent) 1px, transparent 1px)`,
//       backgroundSize: "36px 36px",
//     }}
//   />
// );

// const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
//   <motion.div
//     className="absolute rounded-full blur-3xl pointer-events-none opacity-20"
//     style={{ width: size, height: size, top, left, background: color }}
//     animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
//     transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
//   />
// );

// const Field = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required }) => (
//   <div className="flex flex-col gap-2">
//     <label className="text-[10px] font-black tracking-[0.45em] text-[var(--text-muted)] uppercase">
//       {label}
//     </label>
//     <div className="relative group">
//       {Icon && (
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
//           <Icon className="w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors duration-300" />
//         </div>
//       )}
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         className="w-full bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium
//           placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]
//           transition-all duration-300 py-4 pr-4 tracking-wide shadow-sm"
//         style={{
//           paddingLeft: Icon ? "2.75rem" : "1rem",
//           clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
//         }}
//       />
//     </div>
//   </div>
// );

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleLogin(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const res = await api.post("/auth/login", { email, password });
//       const { token, user } = res.data;
//       if (user.role !== "admin") {
//         setError("Access denied. Admin account required.");
//         return;
//       }
//       setAuth({ token, ...user });
//       navigate("/admin/dashboard");
//     } catch (err) {
//       setError(err?.response?.data?.message || "Login failed.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="relative min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-6 overflow-hidden transition-colors duration-500">
//       <NoiseSVG />
//       <GridDots />
      
//       {/* Dynamic Orbs that use theme accent colors */}
//       <GlowOrb color="var(--accent)" size={400} top="-5%" left="-5%" delay={0} />
//       <GlowOrb color="var(--accent-hover)" size={300} top="60%" left="70%" delay={2} />

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="relative z-10 w-full max-w-md"
//       >
//         <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--border)] p-8 shadow-2xl rounded-sm">
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
//                 <ShieldCheck className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-[var(--text-primary)] font-bold text-lg leading-tight">Admin Portal</h1>
//                 <p className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">Secure Access</p>
//               </div>
//             </div>
//             <button
//               onClick={() => navigate("/")}
//               className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-2 hover:bg-[var(--bg-tertiary)] rounded-full"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-6">
//             <Field
//               label="System ID / Email"
//               icon={Mail}
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="admin@privyprint.com"
//               required
//             />
//             <Field
//               label="Access Code"
//               icon={Lock}
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//             />

//             {error && (
//               <motion.div
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                 className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 font-semibold uppercase tracking-widest text-center"
//               >
//                 {error}
//               </motion.div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-4 px-6 
//                 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg shadow-[var(--accent)]/25"
//               style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}
//             >
//               {loading ? (
//                 <Cpu className="w-5 h-5 animate-spin" />
//               ) : (
//                 <>
//                   INITIALIZE SESSION
//                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }





// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../services/api";
// import { setAuth } from "../../services/authStorage";
// import { motion } from "framer-motion";
// import { Mail, Lock, ShieldCheck, Cpu, ArrowLeft, ChevronRight } from "lucide-react";

// /* ── Restoration: Layer 1 - Noise grain overlay ── */
// const NoiseSVG = () => (
//   <svg
//     className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none z-0"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <filter id="noise">
//       <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
//       <feColorMatrix type="saturate" values="0" />
//     </filter>
//     <rect width="100%" height="100%" filter="url(#noise)" />
//   </svg>
// );

// /* ── Restoration: Layer 2 - Grid dots ── */
// const GridDots = () => (
//   <div
//     className="absolute inset-0 pointer-events-none opacity-[0.06]"
//     style={{
//       backgroundImage: `radial-gradient(circle, var(--accent) 1px, transparent 1px)`,
//       backgroundSize: "36px 36px",
//     }}
//   />
// );

// /* ── Restoration: Layer 3 - Layered Glow Orbs ── */
// const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
//   <motion.div
//     className="absolute rounded-full blur-3xl pointer-events-none"
//     style={{ width: size, height: size, top, left, background: color }}
//     animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
//     transition={{ duration: 7, repeat: Infinity, delay, ease: "easeInOut" }}
//   />
// );

// /* ── Restoration: Layer 4 - Moving Scan Line ── */
// const ScanLine = () => (
//   <motion.div
//     className="absolute left-0 right-0 h-[1.5px] pointer-events-none z-10"
//     style={{
//       background:
//         "linear-gradient(90deg, transparent, rgba(242,103,22,0.3) 50%, transparent)",
//     }}
//     animate={{ top: ["0%", "100%"] }}
//     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//   />
// );

// /* ── Restoration: Inputs and Angles ── */
// const Field = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required }) => (
//   <div className="flex flex-col gap-2.5">
//     <label className="text-[10px] font-black tracking-[0.4em] text-[var(--text-muted)] uppercase">
//       {label}
//     </label>
//     <div className="relative group">
//       {Icon && (
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
//           <Icon className="w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors duration-300" />
//         </div>
//       )}
//       <input
//         type={type}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         required={required}
//         /* Increased padding and height */
//         className="w-full bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium
//           placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]
//           transition-all duration-300 py-4.5 pr-4 tracking-wide shadow-inner"
//         style={{
//           paddingLeft: Icon ? "2.75rem" : "1.25rem",
//           /* Angled cut-out restoration */
//           clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
//         }}
//       />
//       <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--accent)]/0 group-focus-within:bg-[var(--accent)]/40 transition-all duration-300" />
//     </div>
//   </div>
// );

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleLogin(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const res = await api.post("/auth/login", { email, password });
//       const { token, user } = res.data;
//       if (user.role !== "admin") {
//         setError("Access denied. Admin account required.");
//         return;
//       }
//       setAuth({ token, ...user });
//       navigate("/admin/dashboard");
//     } catch (err) {
//       setError(err?.response?.data?.message || "Authentication failed.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="relative min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-6 overflow-hidden transition-colors duration-500 font-sans">
//       <NoiseSVG />
//       <GridDots />
//       <ScanLine />
      
//       {/* Dynamic Orbs restored and theme-compatible */}
//       <GlowOrb color="var(--accent)" size={480} top="-10%" left="-6%" delay={0} />
//       <GlowOrb color="var(--dark-accent-light, #a62f03)" size={360} top="45%" left="58%" delay={2} />
//       <GlowOrb color="var(--dark-input-bg, #591202)" size={220} top="68%" left="12%" delay={4} />

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.65, ease: "easeOut" }}
//         className="relative z-10 w-full max-w-md"
//       >
//         <div className="bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--border)] p-8 shadow-2xl shadow-[var(--shadow)] rounded-sm">
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//               {/* Restoration: Correct dimensions and glow for top logo */}
//               <div className="w-11 h-11 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-lg shadow-[var(--accent)]/20 border border-[var(--accent)]/15">
//                 <ShieldCheck className="w-6.5 h-6.5 text-white" strokeWidth={1.5} />
//               </div>
//               <div>
//                 <h1 className="text-[var(--text-primary)] font-bold text-lg leading-tight">Admin Portal</h1>
//                 <p className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider">Secure Access Required</p>
//               </div>
//             </div>
//             <button
//               onClick={() => navigate("/")}
//               className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-2.5 hover:bg-[var(--bg-tertiary)] rounded-full"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-6.5">
//             <Field
//               label="System ID / Email"
//               icon={Mail}
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="admin@privyprint.com"
//               required
//             />
//             <Field
//               label="Access Code"
//               icon={Lock}
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//             />

//             {error && (
//               <motion.div
//                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                 className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 font-semibold uppercase tracking-widest text-center rounded-sm"
//               >
//                 {error}
//               </motion.div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               /* Height increased and angled cut-out restored */
//               className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-4 px-6 
//                 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg shadow-[var(--accent)]/25"
//               style={{ 
//                 clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
//                 border: "1px solid var(--accent-hover)",
//               }}
//             >
//               {loading ? (
//                 <Cpu className="w-5 h-5 animate-spin" />
//               ) : (
//                 <>
//                   <span className="tracking-wide">INITIALIZE SESSION</span>
//                   <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { api } from "../../services/api";
// import { setAuth } from "../../services/authStorage";
// import { motion } from "framer-motion";
// import { Mail, Lock, ShieldCheck, Cpu, ArrowLeft, ChevronRight } from "lucide-react";

// /* ── Layer 1: Noise grain for that textured look ── */
// const NoiseSVG = () => (
//   <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
//     <filter id="noise">
//       <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
//       <feColorMatrix type="saturate" values="0" />
//     </filter>
//     <rect width="100%" height="100%" filter="url(#noise)" />
//   </svg>
// );

// /* ── Layer 2: Grid system ── */
// const GridDots = () => (
//   <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
//     style={{ backgroundImage: `radial-gradient(circle, var(--accent) 1px, transparent 1px)`, backgroundSize: "36px 36px" }}
//   />
// );

// /* ── Layer 3: Animated Glow Orbs ── */
// const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
//   <motion.div
//     className="absolute rounded-full blur-3xl pointer-events-none opacity-20"
//     style={{ width: size, height: size, top, left, background: color }}
//     animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
//     transition={{ duration: 7, repeat: Infinity, delay, ease: "easeInOut" }}
//   />
// );

// /* ── Layer 4: Vertical Scanline ── */
// const ScanLine = () => (
//   <motion.div
//     className="absolute left-0 right-0 h-[1.5px] pointer-events-none z-10"
//     style={{ background: "linear-gradient(90deg, transparent, var(--accent) 50%, transparent)", opacity: 0.2 }}
//     animate={{ top: ["0%", "100%"] }}
//     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//   />
// );

// const Field = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required }) => (
//   <div className="flex flex-col gap-2.5">
//     <label className="text-[10px] font-black tracking-[0.45em] text-[var(--text-muted)] uppercase pl-1">
//       {label}
//     </label>
//     <div className="relative group">
//       {Icon && (
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
//           <Icon className="w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors duration-300" />
//         </div>
//       )}
//       <input
//         type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
//         className="w-full bg-[var(--input-bg)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-medium
//           placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]
//           transition-all duration-300 py-4.5 pr-4 tracking-wide shadow-inner"
//         style={{
//           paddingLeft: Icon ? "2.75rem" : "1.25rem",
//           clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)",
//         }}
//       />
//       <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--accent)] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
//     </div>
//   </div>
// );

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleLogin(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const res = await api.post("/auth/login", { email, password });
//       const { token, user } = res.data;
//       if (user.role !== "admin") {
//         setError("Access denied. Admin account required.");
//         return;
//       }
//       setAuth({ token, ...user });
//       navigate("/admin/dashboard");
//     } catch (err) {
//       setError(err?.response?.data?.message || "Authentication failed.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="relative min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-6 overflow-hidden transition-colors duration-500 font-sans">
//       <NoiseSVG />
//       <GridDots />
//       <ScanLine />
      
//       {/* Background Ambience */}
//       <GlowOrb color="var(--accent)" size={500} top="-10%" left="-10%" delay={0} />
//       <GlowOrb color="#a62f03" size={400} top="50%" left="60%" delay={2} />
//       <GlowOrb color="#591202" size={300} top="70%" left="5%" delay={4} />

//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="relative z-10 w-full max-w-md"
//       >
//         {/* ── TOP HEADER (Outside the box) ── */}
      
// <div className="flex flex-col items-center mb-6 text-center"> 
//   <motion.div 
//     initial={{ scale: 0, rotate: -180 }}
//     animate={{ scale: 1, rotate: 0 }}
//     transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
//     className="w-16 h-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(242,103,22,0.4)] border border-white/20 mb-4" // Changed mb-6 to mb-4
//   >
//     <ShieldCheck className="w-9 h-9 text-white" strokeWidth={1.5} />
//   </motion.div>
  
//   <h1 className="text-white font-black text-4xl tracking-tighter mb-2"> {/* Bumped to text-4xl */}
//     ADMIN <span className="text-[var(--accent)]">PORTAL</span>
//   </h1>
//   <p className="text-[var(--text-muted)] text-[14px] font-bold uppercase tracking-[0.3em]"> {/* Bumped to 14px */}
//     System Initialization Required
//   </p>
// </div>

//         {/* ── MAIN LOGIN BOX ── */}
//         <div className="bg-[var(--card-bg)] backdrop-blur-2xl border border-[var(--border)] p-10 shadow-2xl shadow-black/50 relative group">
//           {/* Subtle Corner Accents */}
//           <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--accent)]/30" />
//           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--accent)]/30" />

//           <form onSubmit={handleLogin} className="space-y-8">
//             <Field
//               label="Operator Identifier"
//               icon={Mail}
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="admin@privyprint.com"
//               required
//             />
//             <Field
//               label="Security Access Code"
//               icon={Lock}
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               required
//             />

//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
//                 className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] p-3 font-black uppercase tracking-widest text-center"
//               >
//                 {error}
//               </motion.div>
//             )}

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-black py-5 px-6 
//                 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 group shadow-xl shadow-[var(--accent)]/20"
//               style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
//             >
//               {loading ? (
//                 <Cpu className="w-6 h-6 animate-spin" />
//               ) : (
//                 <>
//                   <span className="tracking-[0.2em] text-sm">INITIALIZE SESSION</span>
//                   <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
//                 </>
//               )}
//             </motion.button>
//           </form>
//         </div>

//         {/* ── FOOTER ACTIONS ── */}
//         <div className="mt-8 flex justify-center">
//           <button
//             onClick={() => navigate("/")}
//             className="group flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-all duration-300 text-xs font-black uppercase tracking-widest"
//           >
//             <ArrowLeft className="w-6 h-8 group-hover:-translate-x-2 transition-transform duration-300 text-4xl" />
//             Return to Interface
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }




import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { setAuth } from "../../services/authStorage";
import { Mail, Lock, ChevronRight, ArrowLeft, Cpu } from "lucide-react";
import logoImg from "../../assets/logo1.png";

/* ── Restoration: Layer 1 - Noise grain overlay ── */
const NoiseSVG = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

/* ── Restoration: Layer 2 - Grid dots ── */
const GridDots = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
    style={{ backgroundImage: `radial-gradient(circle, #f26716 1px, transparent 1px)`, backgroundSize: "36px 36px" }}
  />
);

/* ── Restoration: Layer 3 - Animated Glow Orbs ── */
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, top, left, background: color }}
    animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
    transition={{ duration: 7, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

const Field = ({ label, icon: Icon, type = "text", value, onChange, placeholder, required }) => (
  <div className="flex flex-col gap-2.5">
    {/* BUMPED FONT SIZE: text-[13px] */}
    <label className="text-[13px] font-black tracking-[0.45em] text-white/40 uppercase pl-1">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Icon className="w-5 h-5 text-white/30 group-focus-within:text-[#f26716] transition-colors duration-300" />
        </div>
      )}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        /* BUMPED FONT SIZE: text-lg */
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

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;
      setAuth({ token, ...user });
      navigate("/upload");
    } catch (err) {
      setError(err.response?.data?.message || "Access Denied: Invalid Credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
      <NoiseSVG />
      <GridDots />
      
      {/* Background Ambience from your Palette */}
      <GlowOrb color="#f26716" size={500} top="-10%" left="-10%" delay={0} />
      <GlowOrb color="#a62f03" size={400} top="50%" left="60%" delay={2} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
       {/* ── TOP HEADER (Outside the box) ── */}
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-64 h-32 mb-4 flex items-center justify-center relative z-10"
          >
            <img 
              src={logoImg} 
              alt="PrivyPrint" 
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(242,103,22,0.6)]" 
            /> 
          </motion.div>

          <h1 className="text-white font-black text-5xl tracking-tighter mb-0 uppercase">
            Admin <span className="text-[#f26716]">Login</span>
          </h1>
          <p className="text-white/40 text-[14px] font-bold uppercase tracking-[0.5em]">
            Secure Print Interface
          </p>
        </div>

        {/* ── MAIN LOGIN BOX ── */}
        <div className="bg-[#0d0d0d] backdrop-blur-2xl border border-white/5 p-10 shadow-2xl shadow-black/50 relative">
          {/* Subtle Corner Accents */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#f26716]/20" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#f26716]/20" />

          <form onSubmit={handleLogin} className="space-y-8">
            <Field
              label="User Identifier"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@privyprint.com"
              required
            />
            <Field
              label="Security Password"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] p-3 font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#f26716] hover:bg-[#a62f03] text-white font-black py-5 px-6 
                  transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-[#f26716]/20"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
              >
                {loading ? (
                  <Cpu className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="tracking-[0.2em] text-base">INITIALIZE PORTAL</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => navigate("/admin/signup")}
                className="w-full border border-white/10 hover:border-[#f26716]/50 text-white/40 hover:text-white py-4 px-6 
                  transition-all duration-300 text-[11px] font-black uppercase tracking-[0.4em]"
                style={{ clipPath: "polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)" }}
              >
                Create New Account
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 text-white/30 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-300" />
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
